package com.nowpick.backend.cart.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemUpdateRequestDTO {
    private Integer quantity;

}
