package com.nowpick.backend.order.dto;

import com.nowpick.backend.order.domain.OrderItemEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 백엔드에서 클라이언트로 주문 상세 항목 정보를 응답할 때 사용하는 DTO.
 * 주문 항목의 상세 내역을 포함한다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponseDTO {
    private Long orderItemId;
    private Long menuId;
    private String menuName; // 추가
    private Integer quantity;
    private Integer priceAtPurchase;

    public static OrderItemResponseDTO from(OrderItemEntity orderItemEntity) {
        return OrderItemResponseDTO.builder()
                .orderItemId(orderItemEntity.getOrderItemId())
                .menuId(orderItemEntity.getMenu().getMenuId())
                .menuName(orderItemEntity.getMenu().getMenuName()) // 메뉴 이름 추가
                .quantity(orderItemEntity.getQuantity())
                .priceAtPurchase(orderItemEntity.getPriceAtPurchase())
                .build();
    }
}