package com.nowpick.backend.inquiry.controller;

import com.nowpick.backend.inquiry.dto.ChatDTO;
import com.nowpick.backend.inquiry.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatSessionController {

    private final ChatService chatService;

    // 사용자의 채팅 세션 가져오기 (없으면 생성) 및 이전 대화내역 반환
    @PostMapping("/session")
    public ResponseEntity<ChatDTO.SessionResponse> getOrCreateSession(Principal principal) {
        log.info("채팅 세션 생성/가져오기 요청 진입. 요청 사용자: {}", principal.getName());
        ChatDTO.SessionResponse sessionResponse = chatService.getOrCreateChatSession(principal.getName());
        log.info("채팅 세션 성공적으로 처리됨. 세션 ID: {}, 사용자: {}", sessionResponse.getSessionId(), principal.getName());
        return ResponseEntity.ok(sessionResponse);
    }

    // [관리자] 활성(OPEN, CLOSED) 상태인 모든 채팅 세션 목록 조회
    @GetMapping("/sessions/admin")
    public ResponseEntity<List<ChatDTO.SessionResponse>> getActiveSessionsForAdmin(Principal principal) throws AccessDeniedException {
        log.info("[관리자] 활성 채팅 세션 목록 조회 요청. 관리자: {}", principal.getName());
        List<ChatDTO.SessionResponse> sessions = chatService.getActiveChatSessionsForAdmin(principal.getName());
        log.info("[관리자] 활성 채팅 세션 {}개 조회 완료. 관리자: {}", sessions.size(), principal.getName());
        return ResponseEntity.ok(sessions);
    }

    // [관리자] 특정 채팅 세션 상세 조회
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ChatDTO.SessionResponse> getSessionDetails(@PathVariable Long sessionId, Principal principal) throws AccessDeniedException {
        return ResponseEntity.ok(chatService.getChatSessionByIdForAdmin(sessionId, principal.getName()));
    }

    // 채팅 세션 닫기 (상태: CLOSED)
    @PatchMapping("/session/{sessionId}/close")
    public ResponseEntity<Void> closeSession(@PathVariable Long sessionId, Principal principal) throws AccessDeniedException {
        log.info("채팅 세션 닫기 요청. 세션 ID: {}, 요청 사용자: {}", sessionId, principal.getName());
        chatService.closeChatSession(sessionId, principal.getName());
        log.info("채팅 세션 닫기 성공. 세션 ID: {}, 사용자: {}", sessionId, principal.getName());
        return ResponseEntity.ok().build();
    }

    // [관리자] 채팅 세션 아카이브 (상태: ARCHIVED)
    @PatchMapping("/session/{sessionId}/archive")
    public ResponseEntity<Void> archiveSession(@PathVariable Long sessionId, Principal principal) throws AccessDeniedException {
        log.info("[관리자] 채팅 세션 아카이브 요청. 세션 ID: {}, 관리자: {}", sessionId, principal.getName());
        chatService.archiveChatSession(sessionId, principal.getName());
        log.info("[관리자] 채팅 세션 아카이브 성공. 세션 ID: {}, 관리자: {}", sessionId, principal.getName());
        return ResponseEntity.ok().build();
    }
}