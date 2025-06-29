package com.nowpick.backend.order.controller;

import com.nowpick.backend.order.dto.OrderRequestDTO;
import com.nowpick.backend.order.dto.OrderResponseDTO;
import com.nowpick.backend.order.service.OrderService;
import com.nowpick.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(@RequestHeader("Authorization") String authorizationHeader,
                                                       @RequestBody OrderRequestDTO orderRequestDTO) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authorizationHeader.substring(7);
        Long memberId = Long.valueOf(jwtUtil.getMemberIdFromToken(token));

        OrderResponseDTO orderResponse = orderService.placeOrder(orderRequestDTO, memberId);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }
}
