package com.nowpick.backend.payment.entity;

import com.nowpick.backend.order.domain.OrderEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", unique = true, nullable = false)
    private OrderEntity order;

    @Column(name = "imp_uid", length = 100, unique = true, nullable = false)
    private String impUid; // 아임포트 거래 고유 번호

    @Column(name = "payment_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal paymentAmount; // 실제 결제된 금액

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20, nullable = false)
    private PaymentStatus paymentStatus; // 결제 상태 (PAID, FAILED, CANCELLED)

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 50)
    private PaymentMethod paymentMethod; // 결제 수단 (CARD, VBANK 등)

    @Column(name = "receipt_url", length = 255)
    private String receiptUrl; // 카드 결제 영수증 URL

    @Column(name = "paid_at")
    private LocalDateTime paidAt; // 결제 완료 일시

    @Column(name = "failed_at")
    private LocalDateTime failedAt; // 결제 실패 일시

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason; // 결제 실패 사유

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 레코드 생성일시

    public enum PaymentStatus {
        PENDING, PAID, FAILED, CANCELLED
    }

    public enum PaymentMethod {
        CARD, VBANK, TRANS, PHONE, CULT_PHONE // 예시 결제 수단
    }

}
