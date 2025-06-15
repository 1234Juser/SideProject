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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional // 클래스 내의 모든 public 메소드에 트랜잭션을 적용합니다. 작업 중 오류 발생 시, 모든 DB 변경사항을 롤백합니다.
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final ReplyRepository replyRepository;
    private final MemberRepository memberRepository;

    /**
     * 새로운 1:1 문의를 생성하는 메소드
     */
    public InquiryDTO.InquiryResponse createInquiry(InquiryDTO.CreateInquiryRequest dto, String memberUsername) {
        // 1. 사용자 이름을 기반으로 회원 정보를 데이터베이스에서 조회합니다.
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                // 회원을 찾지 못하면 예외를 발생시켜 작업을 중단합니다.
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 2. DTO와 회원 정보를 바탕으로 새로운 InquiryEntity 객체를 생성합니다.
        InquiryEntity inquiry = InquiryEntity.builder()
                .title(dto.getTitle())       // 문의 제목 설정
                .content(dto.getContent())   // 문의 내용 설정
                .member(member)              // 문의 작성자(회원) 정보 설정
                .status(InquiryStatus.PENDING) // 문의 상태를 '답변 대기중(PENDING)'으로 초기 설정
                .build();

        // 3. 생성된 문의 엔티티를 데이터베이스에 저장합니다.
        inquiryRepository.save(inquiry);

        // 4. 저장된 엔티티를 응답 DTO로 변환하여 반환합니다.
        return InquiryDTO.InquiryResponse.from(inquiry);
    }

    /**
     * 문의 목록을 페이징 처리하여 조회하는 메소드
     * 관리자는 모든 문의를, 일반 회원은 자신의 문의만 조회할 수 있습니다.
     */
    @Transactional(readOnly = true) // 데이터 변경이 없는 읽기 전용 트랜잭션으로 설정하여 성능을 최적화합니다.
    public Page<InquiryDTO.InquiryListResponse> getInquiries(Pageable pageable, String memberUsername) {
        // 1. 사용자 이름을 기반으로 회원 정보를 조회합니다.
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Page<InquiryEntity> inquiries;
        // 2. 회원의 역할(Role)에 따라 다른 조회 로직을 수행합니다.
        if ("ADMIN".equals(member.getMemberRole())) {
            // 관리자(ADMIN)일 경우, 모든 문의 목록을 조회합니다.
            inquiries = inquiryRepository.findAll(pageable);
        } else {
            // 일반 회원일 경우, 자신이 작성한 문의 목록만 조회합니다.
            inquiries = inquiryRepository.findByMember(member, pageable);
        }

        // 3. 조회된 엔티티 페이지를 응답 DTO 페이지로 변환하여 반환합니다.
        return inquiries.map(InquiryDTO.InquiryListResponse::from);
    }

    /**
     * 특정 ID의 문의를 상세 조회하는 메소드
     * 관리자 또는 문의 작성자 본인만 조회할 수 있습니다.
     */
    @Transactional(readOnly = true)
    public InquiryDTO.InquiryResponse getInquiryById(Long inquiryId, String memberUsername) throws AccessDeniedException {
        // 1. 문의 ID를 기반으로 문의 엔티티를 조회합니다.
        InquiryEntity inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));

        // 2. 사용자 이름을 기반으로 회원 정보를 조회합니다.
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 3. 접근 권한을 확인합니다. 관리자가 아니고, 문의 작성자 본인도 아닐 경우 접근을 거부합니다.
        if (!"ADMIN".equals(member.getMemberRole()) && !inquiry.getMember().getMemberUsername().equals(memberUsername)) {
            throw new AccessDeniedException("접근 권한이 없습니다.");
        }

        // 4. 조회된 엔티티를 응답 DTO로 변환하여 반환합니다.
        return InquiryDTO.InquiryResponse.from(inquiry);
    }

    /**
     * 문의에 대한 답변을 생성하거나 기존 답변을 수정하는 메소드 (관리자 전용)
     */
    public InquiryDTO.ReplyResponse createOrUpdateReply(Long inquiryId, InquiryDTO.CreateReplyRequest dto, String adminUsername) throws AccessDeniedException {
        // 1. 관리자 아이디로 회원 정보를 조회합니다.
        MemberEntity admin = memberRepository.findByMemberUsername(adminUsername)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정을 찾을 수 없습니다."));

        // 2. 관리자(ADMIN) 역할이 아닐 경우, 예외를 발생시켜 작업을 중단합니다.
        if (!"ADMIN".equals(admin.getMemberRole())) {
            throw new AccessDeniedException("답변을 작성할 권한이 없습니다.");
        }

        // 3. 답변을 달 문의 엔티티를 조회합니다.
        InquiryEntity inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));

        // 4. 해당 문의에 이미 달린 답변이 있는지 확인합니다.
        ReplyEntity reply = inquiry.getReply();
        if (reply == null) {
            // 5-1. 기존 답변이 없는 경우, 새로운 답변을 생성합니다.
            reply = ReplyEntity.builder()
                    .content(dto.getContent()) // 답변 내용 설정
                    .inquiry(inquiry)          // 원본 문의 설정
                    .admin(admin)              // 답변 작성자(관리자) 설정
                    .build();
            inquiry.setReply(reply);                       // 문의에 답변을 연결합니다.
            inquiry.setStatus(InquiryStatus.ANSWERED);     // 문의 상태를 '답변 완료(ANSWERED)'로 변경합니다.
            replyRepository.save(reply);                   // 새로운 답변을 데이터베이스에 저장합니다.
        } else {
            // 5-2. 기존 답변이 있는 경우, 내용만 수정합니다.
            // @Transactional에 의해 메소드 종료 시 변경된 내용이 자동으로 DB에 반영(dirty checking)됩니다.
            reply.setContent(dto.getContent());
        }

        // 6. 생성되거나 수정된 답변 엔티티를 응답 DTO로 변환하여 반환합니다.
        return InquiryDTO.ReplyResponse.from(reply);
    }
}