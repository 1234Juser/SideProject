package com.nowpick.backend.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCancelRequestDTO {
    private String reason; // 취소 사유
    private BigDecimal cancelRequestAmount; // 취소 요청 금액 (부분 취소 시)
    private String checksum; // 금액 위변조 방지

}
