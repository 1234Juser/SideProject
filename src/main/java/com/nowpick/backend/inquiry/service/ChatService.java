package com.nowpick.backend.inquiry.service;

import com.nowpick.backend.inquiry.domain.ChatMessageEntity;
import com.nowpick.backend.inquiry.domain.ChatSessionEntity;
import com.nowpick.backend.inquiry.domain.ChatSessionStatus;
import com.nowpick.backend.inquiry.domain.SenderType;
import com.nowpick.backend.inquiry.dto.ChatDTO;
import com.nowpick.backend.inquiry.repository.ChatMessageRepository;
import com.nowpick.backend.inquiry.repository.ChatSessionRepository;
import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.repo.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;

    // 사용자의 채팅 세션 가져오기 (없으면 새로 생성)
    public ChatDTO.SessionResponse getOrCreateChatSession(String memberUsername) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        ChatSessionEntity session = chatSessionRepository.findByMemberAndStatusWithMessages(member, ChatSessionStatus.OPEN)
                .orElseGet(() -> {
                    ChatSessionEntity newSession = ChatSessionEntity.builder()
                            .member(member)
                            .status(ChatSessionStatus.OPEN)
                            .build();
                    return chatSessionRepository.save(newSession);
                });

        return ChatDTO.SessionResponse.from(session);
    }

    // [사용자] 본인이 작성한 모든 채팅 세션 목록 조회
    @Transactional(readOnly = true)
    public List<ChatDTO.SessionResponse> getAllChatSessionsForUser(String memberUsername) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 사용자의 모든 채팅 세션을 상태와 상관없이 조회합니다.
        List<ChatSessionEntity> sessions = chatSessionRepository.findByMemberWithMessages(member);
        return sessions.stream().map(ChatDTO.SessionResponse::from).collect(Collectors.toList());
    }

    // [사용자] 본인이 작성한 특정 채팅 세션 상세 조회
    @Transactional(readOnly = true)
    public ChatDTO.SessionResponse getChatSessionByIdForUser(Long sessionId, String memberUsername) throws AccessDeniedException {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        ChatSessionEntity session = chatSessionRepository.findByIdWithMessages(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("채팅 세션을 찾을 수 없습니다."));

        // 요청한 사용자가 해당 세션의 소유자인지 확인
        if (!session.getMember().equals(member)) {
            throw new AccessDeniedException("해당 채팅 세션에 접근할 권한이 없습니다.");
        }

        return ChatDTO.SessionResponse.from(session);
    }


    // 채팅 메시지 저장 및 처리
    public ChatMessageEntity saveMessage(ChatDTO.MessageRequest dto, String senderUsername) throws AccessDeniedException {
        MemberEntity sender = memberRepository.findByMemberUsername(senderUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        ChatSessionEntity session = chatSessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("채팅 세션을 찾을 수 없습니다."));

        // 관리자가 아니면서, 자신의 채팅방이 아닌 경우 접근 거부
        if (!"ROLE_ADMIN".equals(sender.getMemberRole()) && !session.getMember().equals(sender)) {
            throw new AccessDeniedException("자신의 채팅방에만 메시지를 보낼 수 있습니다.");
        }

        SenderType senderType = "ROLE_ADMIN".equals(sender.getMemberRole()) ? SenderType.ADMIN : SenderType.USER;

        ChatMessageEntity messageEntity = ChatMessageEntity.builder()
                .chatSession(session)
                .sender(sender)
                .senderType(senderType)
                .message(dto.getMessage())
                .build();

        return chatMessageRepository.save(messageEntity);
    }

    // [관리자] 활성(OPEN, CLOSED) 상태인 모든 채팅 목록 조회
    @Transactional(readOnly = true)
    public List<ChatDTO.SessionResponse> getActiveChatSessionsForAdmin(String adminUsername) throws AccessDeniedException {
        MemberEntity admin = memberRepository.findByMemberUsername(adminUsername)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정을 찾을 수 없습니다."));

        if (!"ROLE_ADMIN".equals(admin.getMemberRole())) {
            throw new AccessDeniedException("접근 권한이 없습니다.");
        }
        // OPEN과 CLOSED 상태의 세션을 모두 조회
        List<ChatSessionStatus> statuses = List.of(ChatSessionStatus.OPEN, ChatSessionStatus.CLOSED);
        List<ChatSessionEntity> activeSessions = chatSessionRepository.findByStatusesWithMessages(statuses);
        return activeSessions.stream().map(ChatDTO.SessionResponse::from).collect(Collectors.toList());
    }

    // [관리자] 특정 채팅 세션 상세 조회
    @Transactional(readOnly = true)
    public ChatDTO.SessionResponse getChatSessionByIdForAdmin(Long sessionId, String adminUsername) throws AccessDeniedException {
        MemberEntity admin = memberRepository.findByMemberUsername(adminUsername)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정을 찾을 수 없습니다."));

        if (!"ROLE_ADMIN".equals(admin.getMemberRole())) {
            throw new AccessDeniedException("접근 권한이 없습니다.");
        }

        ChatSessionEntity session = chatSessionRepository.findByIdWithMessages(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("채팅 세션을 찾을 수 없습니다."));

        return ChatDTO.SessionResponse.from(session);
    }

    // 채팅 세션 종료 (상태를 CLOSED로 변경)
    public void closeChatSession(Long sessionId, String memberUsername) throws AccessDeniedException {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        ChatSessionEntity session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("채팅 세션을 찾을 수 없습니다."));

        // 관리자 또는 채팅방 주인만 세션을 닫을 수 있음
        if (!"ROLE_ADMIN".equals(member.getMemberRole()) && !session.getMember().equals(member)) {
            throw new AccessDeniedException("세션을 닫을 권한이 없습니다.");
        }

        session.setStatus(ChatSessionStatus.CLOSED);
        session.setClosedAt(LocalDateTime.now());
        chatSessionRepository.save(session);
    }

    // [관리자] 채팅 세션 아카이브 (목록에서 숨김 처리)
    public void archiveChatSession(Long sessionId, String adminUsername) throws AccessDeniedException {
        MemberEntity admin = memberRepository.findByMemberUsername(adminUsername)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정을 찾을 수 없습니다."));

        if (!"ROLE_ADMIN".equals(admin.getMemberRole())) {
            throw new AccessDeniedException("아카이브할 권한이 없습니다.");
        }

        ChatSessionEntity session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("채팅 세션을 찾을 수 없습니다."));

        session.setStatus(ChatSessionStatus.ARCHIVED);
        chatSessionRepository.save(session);
    }
}