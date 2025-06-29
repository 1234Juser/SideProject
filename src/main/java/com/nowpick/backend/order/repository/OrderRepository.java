package com.nowpick.backend.order.repository;

import com.nowpick.backend.order.domain.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository <OrderEntity, Long>{
}
