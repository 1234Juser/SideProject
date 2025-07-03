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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
            @AuthenticationPrincipal UserDetails userDetails, // 인증 정보 사용
            @RequestBody PaymentCallbackRequestDTO request) {

        // userDetails.getUsername()으로 memberId를 얻을 수 있지만, 현재 로직에서는 사용되지 않습니다.
        log.info("결제 콜백: imp_uid={}, merchant_uid={}, status={}",
                request.getImp_uid(), request.getMerchant_uid(), request.getStatus());

        PaymentResponseDTO response = paymentService.processPaymentCallback(request);
        return ResponseEntity.ok(response);
    }


    //단일 결제 정보 조회
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentDetails(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long paymentId) {
        Long memberId = Long.valueOf(userDetails.getUsername());
        PaymentResponseDTO response = paymentService.getPaymentDetails(paymentId, memberId);
        return ResponseEntity.ok(response);
    }


    // 회원 결제 내역 조회
    @GetMapping("/user")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByMember(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long memberId = Long.valueOf(userDetails.getUsername());
        List<PaymentResponseDTO> response = paymentService.getPaymentsByMember(memberId);
        return ResponseEntity.ok(response);
    }


    // 결제 취소 요청
    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<PaymentResponseDTO> cancelPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long paymentId,
            @RequestBody PaymentCancelRequestDTO request) {
        Long memberId = Long.valueOf(userDetails.getUsername());
        log.info("결제 취소 요청 : {}, by memberId: {}", paymentId, memberId);
        PaymentResponseDTO response = paymentService.cancelPayment(paymentId, memberId, request);
        return ResponseEntity.ok(response);
    }








}
