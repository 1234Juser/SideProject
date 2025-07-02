package com.nowpick.backend.payment.controller;

import com.nowpick.backend.payment.dto.PaymentCallbackRequestDTO;
import com.nowpick.backend.payment.dto.PaymentCancelRequestDTO;
import com.nowpick.backend.payment.dto.PaymentResponseDTO;
import com.nowpick.backend.payment.service.PaymentService;
import com.nowpick.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtUtil jwtUtil;

    //결제 결과 콜백(프론트엔드 -> 백엔드_)
    @PostMapping("/callback")
    public ResponseEntity<PaymentResponseDTO> paymentCallback(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody PaymentCallbackRequestDTO request) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authorizationHeader.substring(7);
        Long memberId = Long.valueOf(jwtUtil.getMemberIdFromToken(token)); // 현재 사용자는 인증만하고 실제 사용하지 않음

        log.info("결제 컬백: imp_uid={}, merchant_uid={}, status={}",
                request.getImp_uid(), request.getMerchant_uid(), request.getStatus());


        PaymentResponseDTO response = paymentService.processPaymentCallback(request);
        return ResponseEntity.ok(response);
    }

    //단일 결제 정보 조회
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentDetails(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long paymentId){

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authorizationHeader.substring(7);
        Long memberId = Long.valueOf(jwtUtil.getMemberIdFromToken(token));

        PaymentResponseDTO response = paymentService.getPaymentDetails(paymentId, memberId);
        return ResponseEntity.ok(response);

    }

    // 회원 결제 내역 조회
    @GetMapping("/user")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByMember(
            @RequestHeader("Authorization") String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authorizationHeader.substring(7);
        Long memberId = Long.valueOf(jwtUtil.getMemberIdFromToken(token));

        List<PaymentResponseDTO> response = paymentService.getPaymentsByMember(memberId);
        return ResponseEntity.ok(response);
    }

    // 결제 취소 요청
    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<PaymentResponseDTO> cancelPayment(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long paymentId,
            @RequestBody PaymentCancelRequestDTO request) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authorizationHeader.substring(7);
        Long memberId = Long.valueOf(jwtUtil.getMemberIdFromToken(token));

        log.info("결제 취소 요청 : {}, by memberId: {}", paymentId, memberId);
        PaymentResponseDTO response = paymentService.cancelPayment(paymentId, memberId, request);
        return ResponseEntity.ok(response);
    }







}
