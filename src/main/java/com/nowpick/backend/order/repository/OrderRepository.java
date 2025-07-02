package com.nowpick.backend.order.repository;

import com.nowpick.backend.order.domain.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository <OrderEntity, Long>{
    Optional<OrderEntity> findByMerchantUid(String merchantUid); //결제관련 메서드

}
