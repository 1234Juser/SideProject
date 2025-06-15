package com.nowpick.backend.inquiry.controller;

import com.nowpick.backend.inquiry.domain.ChatMessageEntity;
import com.nowpick.backend.inquiry.dto.ChatDTO;
import com.nowpick.backend.inquiry.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.nio.file.AccessDeniedException;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/chat/sendMessage") // 클라이언트가 "/app/chat/sendMessage"로 메시지를 보냄
    public void sendMessage(@Payload ChatDTO.MessageRequest chatMessageRequest, Principal principal) throws AccessDeniedException {
        // 1. 메시지를 DB에 저장
        ChatMessageEntity savedMessage = chatService.saveMessage(chatMessageRequest, principal.getName());

        // 2. 응답용 DTO로 변환
        ChatDTO.MessageResponse messageResponse = ChatDTO.MessageResponse.from(savedMessage);

        // 3. 해당 채팅방을 구독하고 있는 클라이언트들에게 메시지를 브로드캐스팅
        //    클라이언트는 "/topic/chat/room/{sessionId}"를 구독하고 있어야 함
        messagingTemplate.convertAndSend("/topic/chat/room/" + messageResponse.getSessionId(), messageResponse);

    }
}
