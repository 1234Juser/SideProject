package com.nowpick.backend.payment.repository;

import com.nowpick.backend.payment.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    Optional<PaymentEntity> findByOrderId(Long orderId);
    List<PaymentEntity> findByOrder_Member_MemberId(Long memberId);
    Optional<PaymentEntity> findByImpUid(String impUid);
}
