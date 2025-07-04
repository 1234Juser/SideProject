package com.nowpick.backend.payment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nowpick.backend.member.domain.MemberEntity; // MemberEntity import
import com.nowpick.backend.member.repo.MemberRepository; // MemberRepository import
import com.nowpick.backend.order.domain.OrderEntity;
import com.nowpick.backend.order.repository.OrderRepository;
import com.nowpick.backend.payment.dto.PaymentCallbackRequestDTO;
import com.nowpick.backend.payment.dto.PaymentCancelRequestDTO;
import com.nowpick.backend.payment.dto.PaymentResponseDTO;
import com.nowpick.backend.payment.entity.PaymentEntity;
import com.nowpick.backend.payment.repository.PaymentRepository;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;
    private final ObjectMapper objectMapper;

    private IamportClient iamportClient;

    @Value("${portone.api.key}")
    private String apiKey;

    @Value("${portone.api.secret}")
    private String apiSecret;

    @PostConstruct
    public void init() {
        this.iamportClient = new IamportClient(apiKey, apiSecret);
    }

    /**
     * 결제 결과를 처리하고 검증하는 메서드     *
     * @param request 프론트엔드로부터 받은 결제 콜백 데이터
     * @return 처리된 결제 정보 DTO
     */
    @Transactional
    public PaymentResponseDTO processPaymentCallback(PaymentCallbackRequestDTO request) {
        String impUid = request.getImp_uid();
        String merchantUid = request.getMerchant_uid();

        try {
            IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(impUid);
            Payment paymentData = iamportResponse.getResponse();

            if (paymentData == null) {
                throw new IllegalArgumentException("아임포트에서 결제 정보를 찾을 수 없습니다.");
            }

            log.info("아임포트 결제 정보: {}", objectMapper.writeValueAsString(paymentData));

            OrderEntity order = orderRepository.findByMerchantUid(merchantUid)
                    .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다. merchantUid: " + merchantUid));

            String payMethod = request.getPay_method();
            if (payMethod == null) {
                log.warn("Payment callback request received with null pay_method for merchant_uid: {}", merchantUid);
                payMethod = "UNKNOWN";
            }
            String paymentMethodUpperCase = payMethod.toUpperCase();

            if (!"paid".equals(paymentData.getStatus())) {
                order.setOrderStatus(OrderEntity.OrderStatus.FAILED);
                orderRepository.save(order);
                PaymentEntity failedPayment = PaymentEntity.builder()
                        .order(order)
                        .impUid(impUid)
                        .paymentAmount(BigDecimal.ZERO)
                        .paymentStatus(PaymentEntity.PaymentStatus.FAILED)
                        .paymentMethod(PaymentEntity.PaymentMethod.valueOf(paymentMethodUpperCase))
                        .failedAt(LocalDateTime.now())
                        .failureReason(paymentData.getFailReason() != null ? paymentData.getFailReason() : "결제 실패 (아임포트 상태: " + paymentData.getStatus() + ")")
                        .build();
                return PaymentResponseDTO.from(paymentRepository.save(failedPayment));
            }

            if (order.getOrderTotalAmount().compareTo(paymentData.getAmount()) != 0) {
                cancelPaymentOnMismatch(impUid, order.getOrderTotalAmount(), paymentData.getAmount(), order.getOrderId());
                order.setOrderStatus(OrderEntity.OrderStatus.FAILED);
                orderRepository.save(order);
                PaymentEntity failedPayment = PaymentEntity.builder()
                        .order(order)
                        .impUid(impUid)
                        .paymentAmount(paymentData.getAmount())
                        .paymentStatus(PaymentEntity.PaymentStatus.FAILED)
                        .paymentMethod(PaymentEntity.PaymentMethod.valueOf(paymentMethodUpperCase))
                        .paidAt(timestampToLocalDateTime(paymentData.getPaidAt().getTime() / 1000L))
                        .failedAt(LocalDateTime.now())
                        .failureReason("결제 금액 불일치: 요청(" + order.getOrderTotalAmount() + ") vs 실제(" + paymentData.getAmount() + ")")
                        .build();
                return PaymentResponseDTO.from(paymentRepository.save(failedPayment));
            }

            order.setOrderStatus(OrderEntity.OrderStatus.PAID);
            orderRepository.save(order);

            Optional<PaymentEntity> existingPayment = paymentRepository.findByOrder_OrderId(order.getOrderId());
            PaymentEntity payment;

            if (existingPayment.isPresent()) {
                payment = existingPayment.get();
                payment.setImpUid(impUid);
                payment.setPaymentAmount(paymentData.getAmount());
                payment.setPaymentStatus(PaymentEntity.PaymentStatus.PAID);
                payment.setPaymentMethod(PaymentEntity.PaymentMethod.valueOf(paymentMethodUpperCase));
                payment.setReceiptUrl(paymentData.getReceiptUrl());
                payment.setPaidAt(timestampToLocalDateTime(paymentData.getPaidAt().getTime() / 1000L));
                payment.setFailedAt(null);
                payment.setFailureReason(null);
            } else {
                payment = PaymentEntity.builder()
                        .order(order)
                        .impUid(impUid)
                        .paymentAmount(paymentData.getAmount())
                        .paymentStatus(PaymentEntity.PaymentStatus.PAID)
                        .paymentMethod(PaymentEntity.PaymentMethod.valueOf(paymentMethodUpperCase))
                        .receiptUrl(paymentData.getReceiptUrl())
                        .paidAt(timestampToLocalDateTime(paymentData.getPaidAt().getTime() / 1000L))
                        .build();
            }

            PaymentEntity savedPayment = paymentRepository.save(payment);
            return PaymentResponseDTO.from(savedPayment);

        } catch (Exception e) {
            log.error("결제 콜백 처리 중 오류 발생: impUid={}, merchantUid={}", impUid, merchantUid, e);
            orderRepository.findByMerchantUid(merchantUid).ifPresent(order -> {
                order.setOrderStatus(OrderEntity.OrderStatus.FAILED);
                orderRepository.save(order);
            });
            throw new RuntimeException("결제 처리 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 특정 결제 정보 상세 조회 (memberId 기반)
     * @param paymentId 결제 고유 ID
     * @param memberId 요청한 회원의 ID (보안 검사)
     * @return 결제 정보 DTO
     */
    public PaymentResponseDTO getPaymentDetails(Long paymentId, Long memberId) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 찾을 수 없습니다. ID: " + paymentId));

        if (!payment.getOrder().getMember().getMemberId().equals(memberId)) {
            throw new SecurityException("해당 결제 정보에 접근할 권한이 없습니다.");
        }
        return PaymentResponseDTO.from(payment);
    }

    /**
     * 컨트롤러에서 memberUsername을 직접 받아 처리하기 위한 오버로드 메서드
     * @param paymentId 결제 고유 ID
     * @param memberUsername 요청한 회원의 사용자명
     * @return 결제 정보 DTO
     */
    public PaymentResponseDTO getPaymentDetails(Long paymentId, String memberUsername) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found with username: " + memberUsername));
        Long memberId = member.getMemberId();
        return getPaymentDetails(paymentId, memberId); // 기존 memberId 기반 메서드 호출
    }


    /**
     * 특정 회원의 모든 결제 내역 조회 (memberId 기반)
     * @param memberId 회원의 ID
     * @return 결제 정보 DTO 리스트
     */
    public List<PaymentResponseDTO> getPaymentsByMember(Long memberId) {
        List<PaymentEntity> payments = paymentRepository.findByOrder_Member_MemberId(memberId);
        return payments.stream()
                .map(PaymentResponseDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * 컨트롤러에서 memberUsername을 직접 받아 처리하기 위한 오버로드 메서드
     * @param memberUsername 회원의 사용자명
     * @return 결제 정보 DTO 리스트
     */
    public List<PaymentResponseDTO> getPaymentsByMember(String memberUsername) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found with username: " + memberUsername));
        Long memberId = member.getMemberId();
        return getPaymentsByMember(memberId);
    }

    /**
     * 결제 취소 (memberId 기반)
     * @param paymentId 취소할 결제 고유 ID
     * @param memberId 요청한 회원의 ID (보안 검사)
     * @param cancelRequest 취소 요청 데이터 (사유, 금액 등)
     * @return 취소된 결제 정보 DTO
     */
    @Transactional
    public PaymentResponseDTO cancelPayment(Long paymentId, Long memberId, PaymentCancelRequestDTO cancelRequest) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 찾을 수 없습니다. ID: " + paymentId));

        if (!payment.getOrder().getMember().getMemberId().equals(memberId)) {
            throw new SecurityException("해당 결제를 취소할 권한이 없습니다.");
        }

        if (payment.getPaymentStatus() == PaymentEntity.PaymentStatus.CANCELLED) {
            throw new IllegalStateException("이미 취소된 결제입니다.");
        }

        try {
            com.siot.IamportRestClient.request.CancelData cancelData;
            if (cancelRequest.getCancelRequestAmount() != null && cancelRequest.getCancelRequestAmount().compareTo(payment.getPaymentAmount()) < 0) {
                if (cancelRequest.getChecksum() == null || cancelRequest.getChecksum().compareTo(cancelRequest.getCancelRequestAmount().toString()) != 0) {
                    throw new IllegalArgumentException("체크섬 불일치: 부분 취소 금액 검증 실패");
                }
                cancelData = new com.siot.IamportRestClient.request.CancelData(
                        payment.getImpUid(),
                        true,
                        cancelRequest.getCancelRequestAmount()
                );
            } else {
                cancelData = new com.siot.IamportRestClient.request.CancelData(payment.getImpUid(), false);
            }

            cancelData.setReason(cancelRequest.getReason() != null ? cancelRequest.getReason() : "고객 요청");

            IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
            log.info("아임포트 결제 취소 응답 (raw): {}", objectMapper.writeValueAsString(cancelResponse));

            if (cancelResponse.getCode() == 1) {
                log.warn("결제 취소 실패 - 아임포트에서 해당 결제건을 찾을 수 없거나 이미 취소되었습니다. impUid={}", payment.getImpUid());
                payment.setPaymentStatus(PaymentEntity.PaymentStatus.CANCELLED);
                payment.getOrder().setOrderStatus(OrderEntity.OrderStatus.CANCELLED);
                payment.setFailureReason("아임포트에서 결제건을 찾을 수 없거나 이미 취소됨");
                payment.setFailedAt(LocalDateTime.now());
                paymentRepository.save(payment);
                orderRepository.save(payment.getOrder());
                return PaymentResponseDTO.from(payment);
            }

            Payment canceledPaymentData = cancelResponse.getResponse();

            if (canceledPaymentData == null) {
                String errorMessage = "아임포트 결제 취소 실패: " +
                        (cancelResponse.getMessage() != null ? cancelResponse.getMessage() : "응답 데이터 없음") +
                        (cancelResponse.getCode() != 0 ? " (코드: " + cancelResponse.getCode() + ")" : "");
                log.error("결제 취소 실패 - {}", errorMessage);
                throw new RuntimeException(errorMessage);
            }
            log.info("아임포트 결제 취소 응답 (parsed): {}", objectMapper.writeValueAsString(canceledPaymentData));

            payment.setPaymentStatus(PaymentEntity.PaymentStatus.CANCELLED);
            payment.getOrder().setOrderStatus(OrderEntity.OrderStatus.CANCELLED);
            payment.setFailureReason(cancelRequest.getReason());
            payment.setPaidAt(null);
            payment.setFailedAt(LocalDateTime.now());

            paymentRepository.save(payment);
            orderRepository.save(payment.getOrder());

            return PaymentResponseDTO.from(payment);

        } catch (Exception e) {
            log.error("결제 취소 중 오류 발생: paymentId={}", paymentId, e);
            throw new RuntimeException("결제 취소 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 컨트롤러에서 memberUsername을 직접 받아 처리하기 위한 오버로드 메서드
     * @param paymentId 취소할 결제 고유 ID
     * @param memberUsername 요청한 회원의 사용자명
     * @param request 취소 요청 데이터
     * @return 취소된 결제 정보 DTO
     */
    @Transactional
    public PaymentResponseDTO cancelPayment(Long paymentId, String memberUsername, PaymentCancelRequestDTO request) {
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found with username: " + memberUsername));
        Long memberId = member.getMemberId();
        return cancelPayment(paymentId, memberId, request);
    }

    // 금액 불일치 시 아임포트 결제 취소 (백엔드에서 자동 취소)
    private void cancelPaymentOnMismatch(String impUid, BigDecimal orderAmount, BigDecimal actualPaidAmount, Long orderId) {
        log.warn("결제 금액 불일치 감지. imp_uid: {}, 주문 금액: {}, 실제 결제 금액: {}", impUid, orderAmount, actualPaidAmount);
        try {
            com.siot.IamportRestClient.request.CancelData cancelData = new com.siot.IamportRestClient.request.CancelData(impUid, false);
            cancelData.setReason("결제 금액 불일치 (백엔드 자동 취소) - 주문 ID: " + orderId);
            IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
            if (cancelResponse.getResponse() != null) {
                log.info("불일치 결제 자동 취소 성공: impUid={}", impUid);
            } else {
                log.error("불일치 결제 자동 취소 실패: impUid={}", impUid + ", 사유: " + cancelResponse.getMessage());
            }
        } catch (Exception e) {
            log.error("불일치 결제 자동 취소 중 예외 발생: impUid={}", impUid, e);
        }
    }

    // Unix timestamp를 LocalDateTime으로 변환
    private LocalDateTime timestampToLocalDateTime(Long timestamp) {
        if (timestamp == null) return null;
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(timestamp), ZoneId.systemDefault());
    }

    // 관리자용: 모든 결제 내역 조회
    public List<PaymentResponseDTO> getAllPayments() {
        List<PaymentEntity> payments = paymentRepository.findAll();
        return payments.stream()
                .map(PaymentResponseDTO::from)
                .collect(Collectors.toList());
    }

    // 관리자용: 특정 날짜의 모든 결제 내역 조회
    public List<PaymentResponseDTO> getAllPaymentsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay().minusNanos(1);

        List<PaymentEntity> payments = paymentRepository.findByPaidAtBetween(startOfDay, endOfDay);
        return payments.stream()
                .map(PaymentResponseDTO::from)
                .collect(Collectors.toList());
    }
}
