package com.nowpick.backend.payment.dto;

import com.nowpick.backend.payment.entity.PaymentEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// 결제 등록 및 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    private Long paymentId;
    private Long orderId;
    private String impUid;
    private BigDecimal paymentAmount;
    private String paymentStatus;
    private String paymentMethod;
    private String receiptUrl;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private String failureReason;

    public static PaymentResponseDTO from(PaymentEntity entity) {
        return PaymentResponseDTO.builder()
                .paymentId(entity.getPaymentId())
                .orderId(entity.getOrder().getOrderId())
                .impUid(entity.getImpUid())
                .paymentAmount(entity.getPaymentAmount())
                .paymentStatus(entity.getPaymentStatus().name())
                .paymentMethod(entity.getPaymentMethod() != null ? entity.getPaymentMethod().name() : null)
                .receiptUrl(entity.getReceiptUrl())
                .paidAt(entity.getPaidAt())
                .createdAt(entity.getCreatedAt())
                .failureReason(entity.getFailureReason())
                .build();
    }
}

