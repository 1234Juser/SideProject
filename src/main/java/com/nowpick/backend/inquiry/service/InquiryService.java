package com.nowpick.backend.inquiry.service;

import com.nowpick.backend.inquiry.domain.InquiryEntity;
import com.nowpick.backend.inquiry.domain.InquiryStatus;
import com.nowpick.backend.inquiry.domain.ReplyEntity;
import com.nowpick.backend.inquiry.dto.InquiryDTO;
import com.nowpick.backend.inquiry.repository.InquiryRepository;
import com.nowpick.backend.inquiry.repository.ReplyRepository;
import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.repo.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

@Service
@RequiredArgsConstructor
@Transactional
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final ReplyRepository replyRepository;
    private final MemberRepository memberRepository;

    public InquiryDTO.InquiryResponse createInquiry(InquiryDTO.CreateInquiryRequest dto, String memberUsername) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        InquiryEntity inquiry = InquiryEntity.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .member(member)
                .status(InquiryStatus.PENDING)
                .build();

        inquiryRepository.save(inquiry);

        return InquiryDTO.InquiryResponse.from(inquiry);
    }

    @Transactional(readOnly = true)
    public Page<InquiryDTO.InquiryListResponse> getInquiries(Pageable pageable, String memberUsername) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Page<InquiryEntity> inquiries;
        if ("ADMIN".equals(member.getMemberRole())) {
            inquiries = inquiryRepository.findAll(pageable);
        } else {
            inquiries = inquiryRepository.findByMember(member, pageable);
        }

        return inquiries.map(InquiryDTO.InquiryListResponse::from);
    }

    @Transactional(readOnly = true)
    public InquiryDTO.InquiryResponse getInquiryById(Long inquiryId, String memberUsername) throws AccessDeniedException {
        InquiryEntity inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));

        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        if (!"ADMIN".equals(member.getMemberRole()) && !inquiry.getMember().getMemberUsername().equals(memberUsername)) {
            throw new AccessDeniedException("접근 권한이 없습니다.");
        }

        return InquiryDTO.InquiryResponse.from(inquiry);
    }

    public InquiryDTO.ReplyResponse createOrUpdateReply(Long inquiryId, InquiryDTO.CreateReplyRequest dto, String adminUsername) throws AccessDeniedException {
        MemberEntity admin = memberRepository.findByMemberUsername(adminUsername)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정을 찾을 수 없습니다."));

        if (!"ADMIN".equals(admin.getMemberRole())) {
            throw new AccessDeniedException("답변을 작성할 권한이 없습니다.");
        }

        InquiryEntity inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));

        ReplyEntity reply = inquiry.getReply();
        if (reply == null) {
            reply = ReplyEntity.builder()
                    .content(dto.getContent())
                    .inquiry(inquiry)
                    .admin(admin)
                    .build();
            inquiry.setReply(reply);
            inquiry.setStatus(InquiryStatus.ANSWERED);
            replyRepository.save(reply);
        } else {
            reply.setContent(dto.getContent());
        }

        return InquiryDTO.ReplyResponse.from(reply);
    }
}