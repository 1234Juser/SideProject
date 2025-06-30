package com.nowpick.backend.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 주문 요청 시, 개별 주문 항목(메뉴)의 정보를 담는 DTO.
 * 클라이언트에서 백엔드로 전송되는 데이터.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Long menuId;
    private Integer quantity;
}