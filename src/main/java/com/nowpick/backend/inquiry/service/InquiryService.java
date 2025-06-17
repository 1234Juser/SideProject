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
import java.util.List;

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
    @Transactional(readOnly = true)
    public Page<InquiryDTO.InquiryListResponse> getInquiries(Pageable pageable, String memberUsername) {
        // 현재 로그인한 사용자 정보 조회
        MemberEntity currentMember = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + memberUsername));

        Page<InquiryEntity> inquiriesPage;

        // 사용자의 역할이 'ROLE_ADMIN'인지 확인
        if ("ROLE_ADMIN".equals(currentMember.getMemberRole())) {
            // 관리자인 경우: 모든 문의 조회
            inquiriesPage = inquiryRepository.findAll(pageable); // 여기가 중요합니다.
            log.info("관리자 '{}'가 모든 문의를 조회합니다.", memberUsername);
        } else {
            // 일반 사용자인 경우: 자신의 문의만 조회
            inquiriesPage = inquiryRepository.findByMember(currentMember, pageable);
            log.info("사용자 '{}'가 자신의 문의를 조회합니다.", memberUsername);
        }

        // InquiryEntity Page를 InquiryDTO.InquiryListResponse Page로 변환
        return inquiriesPage.map(InquiryDTO.InquiryListResponse::from);
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
        if (!"ROLE_ADMIN".equals(member.getMemberRole()) && !inquiry.getMember().getMemberUsername().equals(memberUsername)) {
            throw new AccessDeniedException("접근 권한이 없습니다.");
        }

        // 4. 조회된 엔티티를 응답 DTO로 변환하여 반환합니다.
        return InquiryDTO.InquiryResponse.from(inquiry);
    }

    /**
     * 문의에 대한 답변을 생성하거나 기존 답변을 수정하는 메소드 (관리자 전용)
     * 이미 종료된 문의에는 답변을 추가하거나 수정할 수 없습니다.
     * 기존 답변이 있는 경우, 해당 답변을 작성한 관리자만 수정할 수 있습니다.
     */
    public InquiryDTO.ReplyResponse createOrUpdateReply(Long inquiryId, InquiryDTO.CreateReplyRequest dto, String adminUsername) throws AccessDeniedException {
        // 1. 관리자 아이디로 회원 정보를 조회합니다.
        MemberEntity admin = memberRepository.findByMemberUsername(adminUsername)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정을 찾을 수 없습니다."));

        // 2. 관리자(ADMIN) 역할이 아닐 경우, 예외를 발생시켜 작업을 중단합니다.
        if (!"ROLE_ADMIN".equals(admin.getMemberRole())) {
            throw new AccessDeniedException("답변을 작성하거나 수정할 권한이 없습니다.");
        }

        // 3. 답변을 달 문의 엔티티를 조회합니다.
        InquiryEntity inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));

        // 4. 문의가 이미 종료되었으면 답변을 추가하거나 수정할 수 없습니다.
        if (inquiry.getStatus() == InquiryStatus.CLOSED) {
            throw new IllegalStateException("이미 종료된 문의에는 답변을 작성하거나 수정할 수 없습니다.");
        }

        // 5. 해당 문의에 이미 달린 답변이 있는지 확인합니다.
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
            // 5-2. 기존 답변이 있는 경우, 해당 답변을 작성한 관리자만 수정 가능합니다.
            if (!reply.getAdmin().getMemberUsername().equals(adminUsername)) {
                throw new AccessDeniedException("이 답변을 수정할 권한이 없습니다. 답변은 해당 답변을 작성한 관리자만 수정할 수 있습니다.");
            }
            reply.setContent(dto.getContent()); // 내용만 수정
        }

        // 6. 생성되거나 수정된 답변 엔티티를 응답 DTO로 변환하여 반환합니다.
        return InquiryDTO.ReplyResponse.from(reply);
    }

    /**
     * 문의에 대한 답변을 삭제하는 메소드 (관리자 전용)
     * 이미 종료된 문의에는 답변을 삭제할 수 없습니다.
     * 해당 답변을 작성한 관리자만 삭제할 수 있습니다.
     */
    public void deleteReply(Long inquiryId, String adminUsername) throws AccessDeniedException {
        // 1. 관리자 아이디로 회원 정보를 조회합니다.
        MemberEntity admin = memberRepository.findByMemberUsername(adminUsername)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정을 찾을 수 없습니다."));

        // 2. 관리자(ADMIN) 역할이 아닐 경우, 예외를 발생시켜 작업을 중단합니다.
        if (!"ROLE_ADMIN".equals(admin.getMemberRole())) {
            throw new AccessDeniedException("답변을 삭제할 권한이 없습니다.");
        }

        // 3. 답변을 삭제할 문의 엔티티를 조회합니다.
        InquiryEntity inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));

        // 4. 문의가 이미 종료되었으면 답변을 삭제할 수 없습니다.
        if (inquiry.getStatus() == InquiryStatus.CLOSED) {
            throw new IllegalStateException("이미 종료된 문의의 답변은 삭제할 수 없습니다.");
        }

        // 5. 해당 문의에 답변이 있는지 확인합니다.
        ReplyEntity reply = inquiry.getReply();
        if (reply == null) {
            throw new IllegalArgumentException("해당 문의에 답변이 존재하지 않습니다.");
        }

        // 6. 답변 작성자(관리자)와 현재 삭제 요청한 관리자가 동일한지 확인합니다.
        if (!reply.getAdmin().getMemberUsername().equals(adminUsername)) {
            throw new AccessDeniedException("이 답변을 삭제할 권한이 없습니다. 답변은 해당 답변을 작성한 관리자만 삭제할 수 있습니다.");
        }

        // 7. 문의에서 답변 연결을 해제하고, 문의 상태를 PENDING으로 변경합니다.
        inquiry.setReply(null);
        inquiry.setStatus(InquiryStatus.PENDING);

        // 8. 데이터베이스에서 답변을 삭제합니다.
        replyRepository.delete(reply);
        log.info("문의 ID '{}'에 대한 답변이 관리자 '{}'에 의해 삭제되었습니다. 문의 상태가 '{}'로 변경되었습니다.", inquiryId, adminUsername, InquiryStatus.PENDING);
    }


    /**
     * 사용자가 자신의 1:1 문의를 종료 상태로 변경하는 메소드
     *
     * @param inquiryIds 종료할 문의 ID 목록
     * @param memberUsername 요청한 사용자의 ID
     * @throws AccessDeniedException 문의에 대한 접근 권한이 없을 경우
     */
    @Transactional
    public void closeInquiries(List<Long> inquiryIds, String memberUsername) throws AccessDeniedException {
        MemberEntity currentMember = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + memberUsername));

        List<InquiryEntity> inquiriesToClose = inquiryRepository.findAllById(inquiryIds);

        for (InquiryEntity inquiry : inquiriesToClose) {
            // 관리자가 아니면서, 해당 문의의 작성자가 현재 사용자가 아닐 경우
            if (!"ROLE_ADMIN".equals(currentMember.getMemberRole()) && !inquiry.getMember().getMemberUsername().equals(memberUsername)) {
                log.warn("사용자 '{}'가 문의 ID '{}'에 대한 종료 권한이 없습니다.", memberUsername, inquiry.getId());
                throw new AccessDeniedException("문의를 종료할 권한이 없습니다: " + inquiry.getId());
            }
            // 이미 종료되었거나 답변 완료된 문의는 다시 종료할 필요 없음.
            // PENDING, ANSWERED 상태만 CLOSED로 변경 가능하도록 제한
            if (inquiry.getStatus() == InquiryStatus.PENDING || inquiry.getStatus() == InquiryStatus.ANSWERED) {
                inquiry.setStatus(InquiryStatus.CLOSED);
                // inquiryRepository.save(inquiry); // @Transactional이므로 명시적 저장은 필수는 아니지만, 명확성을 위해 유지할 수 있습니다.
                log.info("문의 ID '{}'의 상태가 '{}'로 변경되었습니다. 요청 사용자: '{}'", inquiry.getId(), InquiryStatus.CLOSED, memberUsername);
            } else {
                log.info("문의 ID '{}'는 이미 '{}' 상태이므로 변경하지 않습니다.", inquiry.getId(), inquiry.getStatus());
            }
        }
    }

}