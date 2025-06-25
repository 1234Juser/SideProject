package com.nowpick.backend.wishlist.controller;

import com.nowpick.backend.wishlist.dto.WishlistAddRequestDTO;
import com.nowpick.backend.wishlist.dto.WishlistResponseDTO;
import com.nowpick.backend.wishlist.service.WishListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishListController {

    private final WishListService wishListService;

    /**
     * 찜 등록 API
     * POST /api/wishlist
     * @param requestDTO 찜할 메뉴의 ID를 포함하는 요청 DTO
     * @param userDetails 현재 인증된 사용자의 정보
     * @return 등록된 찜 항목의 정보와 HTTP 상태 코드
     */
    @PostMapping
    public ResponseEntity<WishlistResponseDTO> addWishlist(
            @RequestBody @Valid WishlistAddRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String memberUsername = userDetails.getUsername(); // JWT에서 사용자 이름 추출
            WishlistResponseDTO response = wishListService.addWishlist(memberUsername, requestDTO.getMenuId());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException | IllegalStateException e) {
            // 회원, 메뉴를 찾을 수 없거나 이미 찜 목록에 있는 경우
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 그 외 예상치 못한 오류
            return new ResponseEntity("찜 등록 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 찜 취소 API
     * DELETE /api/wishlist/{menuId}
     * @param menuId 취소할 메뉴의 ID (경로 변수)
     * @param userDetails 현재 인증된 사용자의 정보
     * @return HTTP 상태 코드 (204 No Content)
     */
    @DeleteMapping("/{menuId}")
    public ResponseEntity<Void> removeWishlist(
            @PathVariable Long menuId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String memberUsername = userDetails.getUsername(); // JWT에서 사용자 이름 추출
            wishListService.removeWishlist(memberUsername, menuId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 성공적으로 삭제되었음을 알림
        } catch (IllegalArgumentException e) {
            // 찜 목록에 없는 메뉴인 경우
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 그 외 예상치 못한 오류
            return new ResponseEntity("찜 취소 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 찜 목록 조회 API
     * GET /api/wishlist
     * @param userDetails 현재 인증된 사용자의 정보
     * @return 사용자의 찜 목록 정보와 HTTP 상태 코드
     */
    @GetMapping
    public ResponseEntity<List<WishlistResponseDTO>> getWishlists(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String memberUsername = userDetails.getUsername(); // JWT에서 사용자 이름 추출
            List<WishlistResponseDTO> wishlists = wishListService.getWishlists(memberUsername);
            return new ResponseEntity<>(wishlists, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // 회원을 찾을 수 없는 경우 (인증 문제 등)
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // 그 외 예상치 못한 오류
            return new ResponseEntity("찜 목록 조회 중 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
