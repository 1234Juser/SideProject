package com.nowpick.backend.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// 결제 요청 후 아임포트 콜백으로부터 받는 데이터
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCallbackRequestDTO {
    private String imp_uid;
    private String merchant_uid;
    private String status; // 아임포트 결제 상태 (paid, failed, cancelled)
    private BigDecimal paid_amount;
    private String pay_method;
    private String receipt_url;
    private Long paid_at; // Unix timestamp
    private String error_msg;
}
