package com.nowpick.backend.payment.controller;

// import com.nowpick.backend.member.domain.MemberEntity; // [제거됨] MemberEntity import
// import com.nowpick.backend.member.repo.MemberRepository; // [제거됨] MemberRepository import

import com.nowpick.backend.payment.dto.PaymentCallbackRequestDTO;
import com.nowpick.backend.payment.dto.PaymentCancelRequestDTO;
import com.nowpick.backend.payment.dto.PaymentResponseDTO;
import com.nowpick.backend.payment.service.PaymentService;
import com.nowpick.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtUtil jwtUtil;

    // 결제 결과 콜백(프론트엔드 -> 백엔드_)
    @PostMapping("/callback")
    public ResponseEntity<PaymentResponseDTO> paymentCallback(
            @AuthenticationPrincipal UserDetails userDetails, // 인증 정보 사용 (로그 확인용)
            @RequestBody PaymentCallbackRequestDTO request) {

        log.info("결제 콜백: imp_uid={}, merchant_uid={}, status={}",
                request.getImp_uid(), request.getMerchant_uid(), request.getStatus());

        PaymentResponseDTO response = paymentService.processPaymentCallback(request);
        return ResponseEntity.ok(response);
    }


    // 단일 결제 정보 조회
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentDetails(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long paymentId) {
        PaymentResponseDTO response = paymentService.getPaymentDetails(paymentId, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }


    // 회원 결제 내역 조회
    @GetMapping("/user")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByMember(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PaymentResponseDTO> response = paymentService.getPaymentsByMember(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    // 관리자용: 모든 결제 내역 조회 (필터링 포함)
    @GetMapping("/admin/all")
    public ResponseEntity<List<PaymentResponseDTO>> getAllPaymentsForAdmin(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String date) {
        if (!userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new SecurityException("관리자 권한이 필요합니다.");
        }

        List<PaymentResponseDTO> response;
        if (date != null && !date.isEmpty()) {
            LocalDate localDate = LocalDate.parse(date);
            response = paymentService.getAllPaymentsByDate(localDate);
        } else {
            response = paymentService.getAllPayments();
        }
        return ResponseEntity.ok(response);
    }


    // 결제 취소 요청
    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<PaymentResponseDTO> cancelPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long paymentId,
            @RequestBody PaymentCancelRequestDTO request) {
        String memberUsername = userDetails.getUsername();
        log.info("결제 취소 요청 : {}, by memberUsername: {}", paymentId, memberUsername);
        PaymentResponseDTO response = paymentService.cancelPayment(paymentId, memberUsername, request);
        return ResponseEntity.ok(response);
    }
}
