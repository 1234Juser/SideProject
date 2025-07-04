package com.nowpick.backend.cart.service;

import com.nowpick.backend.cart.domain.CartItemRedis;
import com.nowpick.backend.cart.dto.CartItemAddRequestDTO;
import com.nowpick.backend.cart.dto.CartItemUpdateRequestDTO;
import com.nowpick.backend.cart.dto.RedisCartItemResponseDTO;
import com.nowpick.backend.cart.repository.RedisCartRepository;
import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.repo.MemberRepository;
import com.nowpick.backend.menu.domain.MenuEntity;
import com.nowpick.backend.menu.repo.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisCartService { // [이름 변경 확인] CartService 대신 RedisCartService로 사용 중인 경우

    private final RedisCartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final MenuRepository menuRepository;

    // 장바구니에 메뉴 추가 또는 수량 업데이트
    public RedisCartItemResponseDTO addItemToCart(String username, CartItemAddRequestDTO dto) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.: " + username));
        MenuEntity menu = menuRepository.findById(dto.getMenuId())
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + dto.getMenuId()));

        Optional<CartItemRedis> existingCartItem = cartRepository.findByMemberIdAndMenuId(member.getMemberId(), dto.getMenuId());

        CartItemRedis cartItem;
        if (existingCartItem.isPresent()) {
            cartItem = existingCartItem.get();
            cartItem.updateQuantity(cartItem.getQuantity() + dto.getQuantity());
            log.info("Redis 장바구니 항목 수량 업데이트: memberId={}, menuId={}, newQuantity={}", member.getMemberId(), menu.getMenuId(), cartItem.getQuantity());
        } else {
            cartItem = new CartItemRedis(member.getMemberId(), dto.getMenuId(), dto.getQuantity()); // ID는 생성자에서 할당
            log.info("새로운 Redis 장바구니 항목 추가: memberId={}, menuId={}, quantity={}", member.getMemberUsername(), menu.getMenuName(), dto.getQuantity());
        }

        CartItemRedis savedCartItem = cartRepository.save(cartItem);
        return new RedisCartItemResponseDTO(savedCartItem, menu); // [수정됨] RedisCartItemResponseDTO 반환
    }

    // 특정 사용자의 장바구니 목록 조회
    public List<RedisCartItemResponseDTO> getCartItems(String username) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

        List<CartItemRedis> cartItemsRedis = cartRepository.findByMemberId(member.getMemberId());

        return cartItemsRedis.stream()
                .map(redisItem -> {
                    MenuEntity menu = menuRepository.findById(redisItem.getMenuId())
                            .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + redisItem.getMenuId()));
                    return new RedisCartItemResponseDTO(redisItem, menu); // [수정됨] RedisCartItemResponseDTO 반환
                })
                .collect(Collectors.toList());
    }

    // 장바구니 항목 수량 업데이트
    public RedisCartItemResponseDTO updateCartItemQuantity(String username, Long menuId, CartItemUpdateRequestDTO dto) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

        CartItemRedis cartItem = cartRepository.findByMemberIdAndMenuId(member.getMemberId(), menuId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다: memberId=" + member.getMemberId() + ", menuId=" + menuId));

        if (dto.getQuantity() <= 0) {
            cartRepository.deleteByMemberIdAndMenuId(member.getMemberId(), menuId);
            log.info("Redis 장바구니 항목 삭제됨 (수량 0): memberId={}, menuId={}", member.getMemberId(), menuId);
            return null;
        } else {
            cartItem.updateQuantity(dto.getQuantity());
            CartItemRedis updatedCartItem = cartRepository.save(cartItem);
            log.info("Redis 장바구니 항목 수량 업데이트: memberId={}, menuId={}, newQuantity={}", member.getMemberId(), menuId, updatedCartItem.getQuantity());

            MenuEntity menu = menuRepository.findById(updatedCartItem.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + updatedCartItem.getMenuId()));
            return new RedisCartItemResponseDTO(updatedCartItem, menu); // [수정됨] RedisCartItemResponseDTO 반환
        }
    }

    // 장바구니 항목 삭제
    public void removeItemFromCart(String username, Long menuId) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));

        cartRepository.findByMemberIdAndMenuId(member.getMemberId(), menuId)
                .ifPresentOrElse(
                        cartItem -> {
                            cartRepository.deleteByMemberIdAndMenuId(member.getMemberId(), menuId);
                            log.info("Redis 장바구니 항목 삭제 완료: memberId={}, menuId={}", member.getMemberId(), menuId);
                        },
                        () -> {
                            throw new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다: memberId=" + member.getMemberId() + ", menuId=" + menuId);
                        }
                );
    }

    /**
     * 특정 회원의 장바구니를 모두 비웁니다. (결제 완료 후 등)
     * @param username 회원 사용자명
     */
    public void clearCart(String username) {
        MemberEntity member = memberRepository.findByMemberUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username));
        cartRepository.deleteAllByMemberId(member.getMemberId());
        log.info("Redis 장바구니 전체 비우기 완료: memberId={}", member.getMemberId());
    }
}
