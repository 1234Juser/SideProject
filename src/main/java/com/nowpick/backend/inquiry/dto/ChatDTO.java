package com.nowpick.backend.inquiry.dto;

import com.nowpick.backend.inquiry.domain.ChatMessageEntity;
import com.nowpick.backend.inquiry.domain.ChatSessionEntity;
import com.nowpick.backend.inquiry.domain.SenderType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ChatDTO {

    // 클라이언트가 메시지 전송 시 사용하는 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    public static class MessageRequest {
        private Long sessionId;
        private String message;
    }

    // 서버가 클라이언트에게 응답으로 보낼 메시지 DTO
    @Getter
    @Builder
    @AllArgsConstructor
    public static class MessageResponse {
        private Long messageId;
        private Long sessionId;
        private Long senderId;
        private String senderNickname;
        private SenderType senderType;
        private String message;
        private LocalDateTime createdAt;

        public static MessageResponse from(ChatMessageEntity entity) {
            return MessageResponse.builder()
                    .messageId(entity.getId())
                    .sessionId(entity.getChatSession().getId())
                    .senderId(entity.getSender().getMemberId())
                    .senderNickname(entity.getSender().getMemberNickname())
                    .senderType(entity.getSenderType())
                    .message(entity.getMessage())
                    .createdAt(entity.getCreatedAt())
                    .build();
        }
    }

    // 채팅 세션 정보 응답 DTO
    @Getter
    @Builder
    @AllArgsConstructor
    public static class SessionResponse {
        private Long sessionId;
        private Long memberId;
        private String memberNickname;
        private String status;
        private LocalDateTime createdAt;
        private List<MessageResponse> messages;

        public static SessionResponse from(ChatSessionEntity entity) {
            return SessionResponse.builder()
                    .sessionId(entity.getId())
                    .memberId(entity.getMember().getMemberId())
                    .memberNickname(entity.getMember().getMemberNickname())
                    .status(entity.getStatus().name())
                    .createdAt(entity.getCreatedAt())
                    .messages(entity.getMessages().stream()
                            .map(MessageResponse::from)
                            .collect(Collectors.toList()))
                    .build();
        }
    }
}

