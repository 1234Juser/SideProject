package com.nowpick.backend.cart.service;

import com.nowpick.backend.cart.domain.CartEntity;
import com.nowpick.backend.cart.dto.CartItemAddRequestDTO;
import com.nowpick.backend.cart.dto.CartItemResponseDTO;
import com.nowpick.backend.cart.dto.CartItemUpdateRequestDTO;
import com.nowpick.backend.cart.repository.CartRepository;
import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.repo.MemberRepository;
import com.nowpick.backend.menu.domain.MenuEntity;
import com.nowpick.backend.menu.repo.MenuRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final MenuRepository menuRepository;

    // 장바구니에 메뉴 추가 또는 수량 업데이트
    @Transactional
    public CartItemResponseDTO addItemToCart(String username, CartItemAddRequestDTO dto) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.: " + username));
        MenuEntity menu = menuRepository.findById(dto.getMenuId())
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + dto.getMenuId()));

        Optional<CartEntity> existingCartItem = cartRepository.findByMemberAndMenu(member, menu);

        CartEntity cartItem;
        if (existingCartItem.isPresent()) {
            // 이미 장바구니에 있는 경우 수량 업데이트
            cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + dto.getQuantity());
            log.info("장바구니 항목 수량 업데이트: cartItemId={}, newQuantity={}", cartItem.getCartItemId(), cartItem.getQuantity());
        } else {
            // 장바구니에 없는 경우 새로 추가
            cartItem = CartEntity.builder()
                    .member(member)
                    .menu(menu)
                    .quantity(dto.getQuantity())
                    .build();
            log.info("새로운 장바구니 항목 추가: member={}, menu={}, quantity={}", member.getMemberUsername(), menu.getMenuName(), dto.getQuantity());
        }

        CartEntity savedCartItem = cartRepository.save(cartItem);
        return new CartItemResponseDTO(savedCartItem);
    }

    // 특정 사용자의 장바구니 목록 조회
    @Transactional(readOnly = true)
    public List<CartItemResponseDTO> getCartItems(String username) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

        List<CartEntity> cartItems = cartRepository.findByMember(member);
        return cartItems.stream()
                .map(CartItemResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 장바구니 항목 수량 업데이트
    @Transactional
    public CartItemResponseDTO updateCartItemQuantity(String username, Long cartItemId, CartItemUpdateRequestDTO dto) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

        CartEntity cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다: " + cartItemId));

        if (!cartItem.getMember().getMemberId().equals(member.getMemberId())) {
            throw new IllegalArgumentException("해당 장바구니 항목에 대한 권한이 없습니다.");
        }

        if (dto.getQuantity() <= 0) {
            // 수량이 0 이하면 삭제 처리 (또는 에러 발생)
            cartRepository.delete(cartItem);
            log.info("장바구니 항목 삭제됨 (수량 0): cartItemId={}", cartItemId);
            return null; // 삭제된 경우 null 반환
        } else {
            cartItem.setQuantity(dto.getQuantity());
            CartEntity updatedCartItem = cartRepository.save(cartItem);
            log.info("장바구니 항목 수량 업데이트: cartItemId={}, newQuantity={}", updatedCartItem.getCartItemId(), updatedCartItem.getQuantity());
            return new CartItemResponseDTO(updatedCartItem);
        }
    }

    // 장바구니 항목 삭제
    @Transactional
    public void removeItemFromCart(String username, Long cartItemId) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

        // 해당 장바구니 항목이 실제 로그인한 사용자의 것인지 확인
        CartEntity cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다: " + cartItemId));

        if (!cartItem.getMember().getMemberId().equals(member.getMemberId())) {
            throw new IllegalArgumentException("해당 장바구니 항목에 대한 권한이 없습니다.");
        }

        cartRepository.delete(cartItem);
        log.info("장바구니 항목 삭제 완료: cartItemId={}", cartItemId);
    }

}

