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
        try {
            ChatDTO.SessionResponse sessionResponse = chatService.getOrCreateChatSession(principal.getName());
            log.info("채팅 세션 성공적으로 처리됨. 세션 ID: {}, 사용자: {}", sessionResponse.getSessionId(), principal.getName());
            return ResponseEntity.ok(sessionResponse);
        } catch (Exception e) {
            log.error("채팅 세션 처리 중 오류 발생. 사용자: {}, 오류: {}", principal.getName(), e.getMessage());
            throw e; // 예외를 다시 던져서 Spring이 적절히 처리하도록 합니다.
        }
    }

    // [관리자] 현재 열려있는 모든 채팅 세션 목록 조회
    @GetMapping("/sessions/open")
    public ResponseEntity<List<ChatDTO.SessionResponse>> getOpenSessions(Principal principal) throws AccessDeniedException {
        log.info("[관리자] 열려있는 채팅 세션 목록 조회 요청 진입. 관리자 사용자: {}", principal.getName());
        List<ChatDTO.SessionResponse> sessions = chatService.getOpenChatSessions(principal.getName());
        log.info("[관리자] 열려있는 채팅 세션 {}개 조회 완료. 관리자 사용자: {}", sessions.size(), principal.getName());
        return ResponseEntity.ok(sessions);
    }

    // 채팅 세션 닫기
    @PatchMapping("/session/{sessionId}/close")
    public ResponseEntity<Void> closeSession(@PathVariable Long sessionId, Principal principal) throws AccessDeniedException {
        log.info("채팅 세션 닫기 요청 진입. 세션 ID: {}, 요청 사용자: {}", sessionId, principal.getName());
        chatService.closeChatSession(sessionId, principal.getName());
        log.info("채팅 세션 닫기 성공. 세션 ID: {}, 사용자: {}", sessionId, principal.getName());
        return ResponseEntity.ok().build();
    }
}