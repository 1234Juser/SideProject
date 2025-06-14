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
        ChatDTO.SessionResponse sessionResponse = chatService.getOrCreateChatSession(principal.getName());
        return ResponseEntity.ok(sessionResponse);
    }

    // [관리자] 현재 열려있는 모든 채팅 세션 목록 조회
    @GetMapping("/sessions/open")
    public ResponseEntity<List<ChatDTO.SessionResponse>> getOpenSessions(Principal principal) throws AccessDeniedException {
        List<ChatDTO.SessionResponse> sessions = chatService.getOpenChatSessions(principal.getName());
        return ResponseEntity.ok(sessions);
    }

    // 채팅 세션 닫기
    @PatchMapping("/session/{sessionId}/close")
    public ResponseEntity<Void> closeSession(@PathVariable Long sessionId, Principal principal) throws AccessDeniedException {
        chatService.closeChatSession(sessionId, principal.getName());
        return ResponseEntity.ok().build();
    }


}
