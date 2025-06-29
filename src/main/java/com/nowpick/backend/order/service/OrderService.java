package com.nowpick.backend.order.service;

import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.repo.MemberRepository;
import com.nowpick.backend.menu.domain.MenuEntity;
import com.nowpick.backend.menu.repo.MenuRepository;
import com.nowpick.backend.order.domain.OrderEntity;
import com.nowpick.backend.order.domain.OrderItemEntity;
import com.nowpick.backend.order.dto.OrderItemDTO;
import com.nowpick.backend.order.dto.OrderRequestDTO;
import com.nowpick.backend.order.dto.OrderResponseDTO;
import com.nowpick.backend.order.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public OrderResponseDTO placeOrder(OrderRequestDTO orderRequestDTO, Long memberId) {
        //1. 회원정보 조회
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다. ID: " + memberId));

        //2. 주문 엔티티 생성
        OrderEntity order = OrderEntity.builder()
                .member(member)
                .merchantUid(UUID.randomUUID().toString())
                .orderStatus(OrderEntity.OrderStatus.PENDING)
                .pickupAt(orderRequestDTO.getPickupAt())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        //3. 주문 상세 항목처리
        for (OrderItemDTO itemDTO : orderRequestDTO.getOrderItems()) {
            MenuEntity menu = menuRepository.findById(itemDTO.getMenuId())
                    .orElseThrow(() -> new EntityNotFoundException("메뉴를 찾을 수 없습니다. ID: " + itemDTO.getMenuId()));

            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .menu(menu)
                    .quantity(itemDTO.getQuantity())
                    .priceAtPurchase(menu.getMenuPrice()) // 주문 시점의 메뉴 가격 기록
                    .build();

            order.addOrderItem(orderItem); // 주문에 주문 상세 항목 추가
            totalAmount = totalAmount.add(BigDecimal.valueOf(menu.getMenuPrice()).multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
        }

        order.setOrderTotalAmount(totalAmount); // 총 주문 금액 설정

        // 4. 주문 저장
        OrderEntity savedOrder = orderRepository.save(order);

        // 5. 응답 DTO 반환
        return OrderResponseDTO.from(savedOrder);
    }
}

