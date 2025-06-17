package com.nowpick.backend.inquiry.dto;

import com.nowpick.backend.inquiry.domain.InquiryEntity;
import com.nowpick.backend.inquiry.domain.InquiryStatus;
import com.nowpick.backend.inquiry.domain.ReplyEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor; // AllArgsConstructor import 추가

import java.time.LocalDateTime;

public class InquiryDTO {

    @Getter
    @NoArgsConstructor
    public static class CreateInquiryRequest {
        private String title;
        private String content;
    }

    @Getter
    @Builder
    public static class InquiryResponse {
        private Long id;
        private String title;
        private String content;
        private InquiryStatus status;
        private String authorNickname;
        private LocalDateTime createdAt;
        private ReplyResponse reply;

        public static InquiryResponse from(InquiryEntity inquiry) {
            return InquiryResponse.builder()
                    .id(inquiry.getId())
                    .title(inquiry.getTitle())
                    .content(inquiry.getContent())
                    .status(inquiry.getStatus())
                    .authorNickname(inquiry.getMember().getMemberNickname())
                    .createdAt(inquiry.getCreatedAt())
                    .reply(inquiry.getReply() != null ? ReplyResponse.from(inquiry.getReply()) : null)
                    .build();
        }
    }

    @Getter
    @Builder
    public static class InquiryListResponse {
        private Long id;
        private String title;
        private InquiryStatus status;
        private String authorNickname;
        private LocalDateTime createdAt;
        private boolean hasReply;

        public static InquiryListResponse from(InquiryEntity inquiry) {
            return InquiryListResponse.builder()
                    .id(inquiry.getId())
                    .title(inquiry.getTitle())
                    .status(inquiry.getStatus())
                    .authorNickname(inquiry.getMember().getMemberNickname())
                    .createdAt(inquiry.getCreatedAt())
                    .hasReply(inquiry.getReply() != null)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    public static class CreateReplyRequest {
        private String content;
    }

    @Getter
    @Builder
    @AllArgsConstructor // Builder를 사용하므로 AllArgsConstructor 추가
    public static class ReplyResponse {
        private Long id;
        private String content;
        private AdminInfo admin; // adminNickname 대신 AdminInfo 객체로 변경
        private LocalDateTime createdAt;

        public static ReplyResponse from(ReplyEntity reply) {
            return ReplyResponse.builder()
                    .id(reply.getId())
                    .content(reply.getContent())
                    .admin(new AdminInfo(reply.getAdmin().getMemberUsername())) // AdminInfo 객체 생성 및 memberUsername 설정
                    .createdAt(reply.getCreatedAt())
                    .build();
        }

        @Getter
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class AdminInfo {
            private String memberUsername;
        }
    }
}