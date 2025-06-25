package com.nowpick.backend.wishlist.service;

import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.repo.MemberRepository;
import com.nowpick.backend.menu.domain.MenuEntity;
import com.nowpick.backend.menu.repo.MenuRepository;
import com.nowpick.backend.wishlist.domain.WishListEntity;
import com.nowpick.backend.wishlist.dto.WishlistResponseDTO;
import com.nowpick.backend.wishlist.repository.WishListRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class WishListService {

    private final WishListRepository wishListRepository;
    private final MemberRepository memberRepository;
    private final MenuRepository menuRepository;

    /**
     * 찜 등록
     * @param memberUsername JWT에서 추출한 사용자 이름
     * @param menuId 찜할 메뉴의 ID
     * @return 등록된 찜 항목의 DTO
     * @throws IllegalArgumentException 회원 또는 메뉴를 찾을 수 없거나 이미 찜 목록에 있는 경우
     */
    @Transactional
    public WishlistResponseDTO addWishlist(String memberUsername, Long menuId) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
        MenuEntity menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));

        if (wishListRepository.existsByMemberAndMenu(member, menu)) {
            throw new IllegalStateException("이미 찜 목록에 추가된 메뉴입니다.");
        }

        WishListEntity wishlistItem = WishListEntity.builder()
                .member(member)
                .menu(menu)
                .build();

        WishListEntity savedItem = wishListRepository.save(wishlistItem);
        return convertToDto(savedItem);
    }

    /**
     * 찜 취소
     * @param memberUsername JWT에서 추출한 사용자 이름
     * @param menuId 취소할 메뉴의 ID
     * @throws IllegalArgumentException 회원, 메뉴를 찾을 수 없거나 찜 목록에 없는 경우
     */
    @Transactional
    public void removeWishlist(String memberUsername, Long menuId) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
        MenuEntity menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));

        if (!wishListRepository.existsByMemberAndMenu(member, menu)) {
            throw new IllegalArgumentException("찜 목록에 없는 메뉴입니다.");
        }

        wishListRepository.deleteByMemberAndMenu(member, menu);
    }

    /**
     * 사용자의 찜 목록 조회
     * @param memberUsername JWT에서 추출한 사용자 이름
     * @return 사용자의 찜 목록 DTO 리스트
     * @throws IllegalArgumentException 회원을 찾을 수 없는 경우
     */
    public List<WishlistResponseDTO> getWishlists(String memberUsername) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        List<WishListEntity> wishlists = wishListRepository.findAllByMemberOrderByCreatedAtDesc(member);
        return wishlists.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * WishListEntity를 WishlistResponseDTO로 변환합니다.
     * @param entity 변환할 WishListEntity
     * @return 변환된 WishlistResponseDTO
     */
    private WishlistResponseDTO convertToDto(WishListEntity entity) {
        return WishlistResponseDTO.builder()
                .wishlistId(entity.getWishlistId())
                .menuId(entity.getMenu().getMenuId())
                .menuName(entity.getMenu().getMenuName())
                .menuDescription(entity.getMenu().getMenuDescription()) // 메뉴 설명 포함
                .menuPrice(entity.getMenu().getMenuPrice())
                .menuImageUrl(entity.getMenu().getMenuImageUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }



}
