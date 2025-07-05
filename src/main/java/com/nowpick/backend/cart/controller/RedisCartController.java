package com.nowpick.backend.cart.controller;

import com.nowpick.backend.cart.dto.CartItemAddRequestDTO;
import com.nowpick.backend.cart.dto.CartItemUpdateRequestDTO;
import com.nowpick.backend.cart.dto.RedisCartItemResponseDTO;
import com.nowpick.backend.cart.service.RedisCartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
public class RedisCartController {

    private final RedisCartService cartService;

    // 장바구니에 항목 추가 (또는 기존 항목 수량 증가)
    @PostMapping
    public ResponseEntity<RedisCartItemResponseDTO> addItemToCart(@AuthenticationPrincipal UserDetails userDetails,
                                                                  @RequestBody CartItemAddRequestDTO dto) {
        log.info("장바구니 추가 요청: 사용자 = {}, 메뉴 ID = {}, 수량 = {}", userDetails.getUsername(), dto.getMenuId(), dto.getQuantity());
        try {
            RedisCartItemResponseDTO response = cartService.addItemToCart(userDetails.getUsername(), dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("장바구니 추가 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 현재 사용자의 장바구니 목록 조회
    @GetMapping
    public ResponseEntity<List<RedisCartItemResponseDTO>> getCartItems(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            log.warn("인증되지 않은 사용자의 장바구니 목록 조회 요청.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        log.info("장바구니 목록 조회 요청: 사용자 = {}", userDetails.getUsername());
        try {
            List<RedisCartItemResponseDTO> cartItems = cartService.getCartItems(userDetails.getUsername());
            return ResponseEntity.ok(cartItems);
        } catch (IllegalArgumentException e) {
            log.error("장바구니 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    // 장바구니 항목 수량 업데이트
    // @PathVariable Long cartItemId -> @PathVariable Long menuId
    @PutMapping("/{menuId}")
    public ResponseEntity<RedisCartItemResponseDTO> updateCartItemQuantity(@AuthenticationPrincipal UserDetails userDetails,
                                                                      @PathVariable Long menuId,
                                                                      @RequestBody CartItemUpdateRequestDTO dto) {
        log.info("장바구니 항목 수량 업데이트 요청: 사용자 = {}, 메뉴 ID = {}, 새 수량 = {}", userDetails.getUsername(), menuId, dto.getQuantity());
        try {
            RedisCartItemResponseDTO response = cartService.updateCartItemQuantity(userDetails.getUsername(), menuId, dto);
            if (response == null) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("장바구니 항목 수량 업데이트 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 장바구니 항목 삭제
    @DeleteMapping("/{menuId}")
    public ResponseEntity<Void> removeItemFromCart(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long menuId) {
        log.info("장바구니 항목 삭제 요청: 사용자 = {}, 메뉴 ID = {}", userDetails.getUsername(), menuId);
        try {
            cartService.removeItemFromCart(userDetails.getUsername(), menuId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("장바구니 항목 삭제 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
