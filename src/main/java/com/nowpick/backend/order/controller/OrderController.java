package com.nowpick.backend.order.controller;

import com.nowpick.backend.member.domain.MemberEntity; // MemberEntity import
import com.nowpick.backend.member.repo.MemberRepository; // [추가됨] MemberRepository import
import com.nowpick.backend.order.dto.OrderRequestDTO;
import com.nowpick.backend.order.dto.OrderResponseDTO;
import com.nowpick.backend.order.service.OrderService;
import com.nowpick.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(
            HttpServletRequest request,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrderRequestDTO orderRequestDTO) {

        String authHeader = request.getHeader("Authorization");
        String jwt = null;
        Long memberId = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                String memberIdString = jwtUtil.getMemberIdFromToken(jwt);
                memberId = Long.valueOf(memberIdString); // String을 Long으로 변환
            } catch (Exception e) {
                log.error("OrderController: JWT에서 memberId 추출 및 변환 실패: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } else {
            log.warn("OrderController: Authorization 헤더가 없거나 Bearer 토큰 형식이 아닙니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        OrderResponseDTO response = orderService.placeOrder(orderRequestDTO, memberId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 특정 주문의 상세 정보를 조회합니다.
     * GET /api/order/{orderId}
     *
     * @param userDetails 현재 인증된 사용자 정보
     * @param orderId 조회할 주문의 ID
     * @return 주문 상세 정보 DTO
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderDetails(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId) {

        String memberUsername = userDetails.getUsername();
        log.info("주문 상세 조회 요청: orderId={}, memberUsername={}", orderId, memberUsername);
        OrderResponseDTO response = orderService.getOrderDetails(orderId, memberUsername);
        return ResponseEntity.ok(response);
    }
}
