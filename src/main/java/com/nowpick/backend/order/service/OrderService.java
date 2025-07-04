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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;
    private final MemberRepository memberRepository; // [유지됨] MemberRepository 주입

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
                .orderItems(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        //3. 주문 상세 항목처리
        for (OrderItemDTO itemDTO : orderRequestDTO.getOrderItems()) {
            MenuEntity menu = menuRepository.findById(itemDTO.getMenuId())
                    .orElseThrow(() -> new EntityNotFoundException("메뉴를 찾을 수 없습니다. ID: " + itemDTO.getMenuId()));

            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .menu(menu)
                    .quantity(itemDTO.getQuantity())
                    .priceAtPurchase(menu.getMenuPrice())
                    .build();

            order.addOrderItem(orderItem);
            totalAmount = totalAmount.add(BigDecimal.valueOf(menu.getMenuPrice()).multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
        }

        order.setOrderTotalAmount(totalAmount);

        // 4. 주문 저장
        OrderEntity savedOrder = orderRepository.save(order);

        return OrderResponseDTO.from(savedOrder);
    }

    /**
     * 특정 주문 ID로 주문 상세 정보를 조회합니다.
     *
     * @param orderId 조회할 주문의 ID
     * @param memberUsername 현재 로그인한 회원의 사용자명 (보안 및 권한 확인용)
     * @return 주문 상세 정보 DTO
     * @throws EntityNotFoundException 주문을 찾을 수 없거나 해당 회원의 주문이 아닌 경우
     */
    public OrderResponseDTO getOrderDetails(Long orderId, String memberUsername) {
        // memberUsername으로 MemberEntity를 조회하여 memberId를 가져옵니다.
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found with username: " + memberUsername));
        Long memberId = member.getMemberId();


        OrderEntity orderEntity = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다. ID: " + orderId));

        // 주문의 소유권을 확인 (해당 회원의 주문이 맞는지 확인)
        if (!orderEntity.getMember().getMemberId().equals(memberId)) {
            throw new EntityNotFoundException("해당 주문에 대한 접근 권한이 없습니다.");
        }

        return OrderResponseDTO.from(orderEntity);
    }
}
