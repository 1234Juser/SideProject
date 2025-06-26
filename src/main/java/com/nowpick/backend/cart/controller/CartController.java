package com.nowpick.backend.cart.controller;

import com.nowpick.backend.cart.dto.CartItemAddRequestDTO;
import com.nowpick.backend.cart.dto.CartItemResponseDTO;
import com.nowpick.backend.cart.dto.CartItemUpdateRequestDTO;
import com.nowpick.backend.cart.service.CartService;
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
public class CartController {

    private final CartService cartService;

    // 장바구니에 항목 추가 (또는 기존 항목 수량 증가)
    @PostMapping
    public ResponseEntity<CartItemResponseDTO> addItemToCart(@AuthenticationPrincipal UserDetails userDetails,
                                                             @RequestBody CartItemAddRequestDTO dto) {
        log.info("장바구니 추가 요청: 사용자 = {}, 메뉴 ID = {}, 수량 = {}", userDetails.getUsername(), dto.getMenuId(), dto.getQuantity());
        try {
            CartItemResponseDTO response = cartService.addItemToCart(userDetails.getUsername(), dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("장바구니 추가 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 현재 사용자의 장바구니 목록 조회
    @GetMapping // 이 부분을 추가합니다.
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            log.warn("인증되지 않은 사용자의 장바구니 목록 조회 요청.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 인증되지 않은 경우 401 반환
        }
        log.info("장바구니 목록 조회 요청: 사용자 = {}", userDetails.getUsername());
        try {
            List<CartItemResponseDTO> cartItems = cartService.getCartItems(userDetails.getUsername());
            return ResponseEntity.ok(cartItems);
        } catch (IllegalArgumentException e) {
            log.error("장바구니 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    // 장바구니 항목 수량 업데이트
    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemResponseDTO> updateCartItemQuantity(@AuthenticationPrincipal UserDetails userDetails,
                                                                      @PathVariable Long cartItemId,
                                                                      @RequestBody CartItemUpdateRequestDTO dto) {
        log.info("장바구니 항목 수량 업데이트 요청: 사용자 = {}, 항목 ID = {}, 새 수량 = {}", userDetails.getUsername(), cartItemId, dto.getQuantity());
        try {
            CartItemResponseDTO response = cartService.updateCartItemQuantity(userDetails.getUsername(), cartItemId, dto);
            if (response == null) { // 수량이 0이 되어 삭제된 경우
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("장바구니 항목 수량 업데이트 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 장바구니 항목 삭제
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeItemFromCart(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long cartItemId) {
        log.info("장바구니 항목 삭제 요청: 사용자 = {}, 항목 ID = {}", userDetails.getUsername(), cartItemId);
        try {
            cartService.removeItemFromCart(userDetails.getUsername(), cartItemId);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (IllegalArgumentException e) {
            log.error("장바구니 항목 삭제 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 권한 없음 또는 항목 없음
        }
    }
}

