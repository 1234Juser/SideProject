package com.nowpick.backend.order.controller;

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

import jakarta.servlet.http.HttpServletRequest; // HttpServletRequest import 추가

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(
            HttpServletRequest request, // [추가됨] HttpServletRequest를 주입받아 요청 헤더에 접근
            @AuthenticationPrincipal UserDetails userDetails, // UserDetails는 여전히 사용 가능하지만, memberId는 여기서 추출
            @RequestBody OrderRequestDTO orderRequestDTO) {

        // JWT 토큰에서 memberId를 직접 추출합니다.
        // 이 방법은 CustomUserDetailsService가 memberUsername을 반환하더라도 작동합니다.
        String authHeader = request.getHeader("Authorization");
        String jwt = null;
        Long memberId = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                // [수정됨] JwtUtil을 사용하여 토큰에서 memberId (subject)를 String으로 가져옵니다.
                String memberIdString = jwtUtil.getMemberIdFromToken(jwt);
                memberId = Long.valueOf(memberIdString); // String을 Long으로 변환
            } catch (Exception e) {
                log.error("OrderController: JWT에서 memberId 추출 및 변환 실패: {}", e.getMessage());
                // JWT가 유효하지 않거나 memberId가 없는 경우 (이론적으로는 JwtAuthenticationFilter에서 걸러져야 함)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } else {
            // Authorization 헤더가 없거나 Bearer 토큰이 아닌 경우
            log.warn("OrderController: Authorization 헤더가 없거나 Bearer 토큰 형식이 아닙니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // [수정됨] orderService.placeOrder 메서드에 memberId를 전달합니다.
        // OrderService의 placeOrder 메서드 시그니처가 Long memberId를 받도록 수정되어야 합니다.
        OrderResponseDTO orderResponse = orderService.placeOrder(orderRequestDTO, memberId);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }

}
