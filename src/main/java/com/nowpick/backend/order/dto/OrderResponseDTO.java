package com.nowpick.backend.order.dto;

import com.nowpick.backend.order.domain.OrderEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 백엔드에서 클라이언트로 주문 정보를 응답할 때 사용하는 DTO.
 * 주문의 전체적인 요약 정보와 상세 항목들을 포함한다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long orderId;
    private String merchantUid;
    private Long memberId;
    private String memberUsername;
    private BigDecimal orderTotalAmount;
    private String orderStatus;
    private LocalDateTime pickupAt;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDTO> orderItems;

    public static OrderResponseDTO from(OrderEntity orderEntity) {
        return OrderResponseDTO.builder()
                .orderId(orderEntity.getOrderId())
                .merchantUid(orderEntity.getMerchantUid())
                .memberId(orderEntity.getMember().getMemberId())
                .memberUsername(orderEntity.getMember().getMemberUsername())
                .orderTotalAmount(orderEntity.getOrderTotalAmount())
                .orderStatus(orderEntity.getOrderStatus().name())
                .pickupAt(orderEntity.getPickupAt())
                .createdAt(orderEntity.getCreatedAt())
                .orderItems(orderEntity.getOrderItems().stream()
                        .map(OrderItemResponseDTO::from)
                        .collect(Collectors.toList()))
                .build();
    }
}