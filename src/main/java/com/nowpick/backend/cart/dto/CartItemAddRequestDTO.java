package com.nowpick.backend.cart.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemAddRequestDTO {
    private Long menuId;
    private Integer quantity;
}
