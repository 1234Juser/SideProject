//package com.nowpick.backend.cart.dto;
//
//import com.nowpick.backend.menu.dto.MenuDTO;
//import lombok.*;
//
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class CartItemResponseDTO {
//    private Long cartItemId;
//    private Integer quantity;
//    private MenuDTO menu; // 메뉴 정보를 포함하기 위한 MenuDTO
//
//    // CartEntity를 CartItemResponseDTO로 변환하는 생성자
//    public CartItemResponseDTO(com.nowpick.backend.cart.domain.CartEntity cartEntity) {
//        this.cartItemId = cartEntity.getCartItemId();
//        this.quantity = cartEntity.getQuantity();
//        this.menu = new MenuDTO(cartEntity.getMenu()); // MenuEntity를 MenuDTO로 변환
//    }
//
//}
