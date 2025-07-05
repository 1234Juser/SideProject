package com.nowpick.backend.cart.dto;

import com.nowpick.backend.cart.domain.CartItemRedis;
import com.nowpick.backend.menu.domain.MenuEntity;
import com.nowpick.backend.menu.dto.MenuDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RedisCartItemResponseDTO {
    private String cartItemId; // Redis ID는 String 타입
    private Integer quantity;
    private MenuDTO menu; // 메뉴 정보를 포함하기 위한 MenuDTO

    // CartItemRedis와 MenuEntity를 받아 RedisCartItemResponseDTO로 변환하는 생성자
    public RedisCartItemResponseDTO(com.nowpick.backend.cart.domain.CartItemRedis cartItemRedis, com.nowpick.backend.menu.domain.MenuEntity menuEntity) {
        this.cartItemId = cartItemRedis.getId(); // Redis ID 사용
        this.quantity = cartItemRedis.getQuantity();
        this.menu = new MenuDTO(menuEntity); // MenuEntity를 MenuDTO로 변환
    }
}
