package com.nowpick.backend.payment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper; // JSON 파싱을 위해 추가

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
     * 결제 결과를 처리하고 검증하는 메서드
     *
     * @param request 프론트엔드로부터 받은 결제 콜백 데이터
     * @return 처리된 결제 정보 DTO
     */
    @Transactional
    public PaymentResponseDTO processPaymentCallback(PaymentCallbackRequestDTO request) {
        String impUid = request.getImp_uid();
        String merchantUid = request.getMerchant_uid();

        try {
            // 1. 아임포트 API 토큰 발급 (선택적, 일반적으로 클라이언트 객체가 내부적으로 처리)
            // AccessToken token = iamportClient.get \\(\\)token().getResponse();
            // log.info("결제 접근 토큰: {}", token.getAccessToken());

            // 2. imp_uid로 아임포트 서버에서 실제 결제 정보 조회
            IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(impUid);
            Payment paymentData = iamportResponse.getResponse();

            if (paymentData == null) {
                throw new IllegalArgumentException("아임포트에서 결제 정보를 찾을 수 없습니다.");
            }

            log.info("아임포트 결제 정보: {}", objectMapper.writeValueAsString(paymentData));

            // 3. merchant_uid로 주문 정보 조회
            OrderEntity order = orderRepository.findByMerchantUid(merchantUid)
                    .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다. merchantUid: " + merchantUid));

            // [수정됨] pay_method가 null일 경우를 대비한 처리: NullPointerException 방지
            String payMethod = request.getPay_method();
            if (payMethod == null) {
                log.warn("Payment callback request received with null pay_method for merchant_uid: {}", merchantUid);
                payMethod = "UNKNOWN"; // 기본값 설정 또는 다른 오류 처리
            }
            String paymentMethodUpperCase = payMethod.toUpperCase(); // null 체크된 payMethod 사용

            // 4. 결제 상태 및 금액 검증
            // 아임포트 상태가 'paid'가 아니면 실패 처리
            if (!"paid".equals(paymentData.getStatus())) {
                order.setOrderStatus(OrderEntity.OrderStatus.FAILED);
                orderRepository.save(order);
                PaymentEntity failedPayment = PaymentEntity.builder()
                        .order(order)
                        .impUid(impUid)
                        .paymentAmount(BigDecimal.ZERO) // 실패 시 금액은 0으로 기록
                        .paymentStatus(PaymentEntity.PaymentStatus.FAILED)
                        .paymentMethod(PaymentEntity.PaymentMethod.valueOf(paymentMethodUpperCase)) // [수정됨] null 체크된 변수 사용
                        .failedAt(LocalDateTime.now())
                        .failureReason(paymentData.getFailReason() != null ? paymentData.getFailReason() : "결제 실패 (아임포트 상태: " + paymentData.getStatus() + ")")
                        .build();
                return PaymentResponseDTO.from(paymentRepository.save(failedPayment));
            }

            // DB에 저장된 주문 금액과 아임포트 실제 결제 금액 비교 (위변조 방지)
            if (order.getOrderTotalAmount().compareTo(paymentData.getAmount()) != 0) {
                // 금액 불일치 시 결제 취소 요청 및 실패 처리
                cancelPaymentOnMismatch(impUid, order.getOrderTotalAmount(), paymentData.getAmount(), order.getOrderId());
                order.setOrderStatus(OrderEntity.OrderStatus.FAILED);
                orderRepository.save(order);
                PaymentEntity failedPayment = PaymentEntity.builder()
                        .order(order)
                        .impUid(impUid)
                        .paymentAmount(paymentData.getAmount())
                        .paymentStatus(PaymentEntity.PaymentStatus.FAILED)
                        .paymentMethod(PaymentEntity.PaymentMethod.valueOf(paymentMethodUpperCase)) // [수정됨] null 체크된 변수 사용
                        .paidAt(timestampToLocalDateTime(paymentData.getPaidAt().getTime() / 1000L))
                        .failedAt(LocalDateTime.now())
                        .failureReason("결제 금액 불일치: 요청(" + order.getOrderTotalAmount() + ") vs 실제(" + paymentData.getAmount() + ")")
                        .build();
                return PaymentResponseDTO.from(paymentRepository.save(failedPayment));
            }

            // 5. 모든 검증 통과 시 결제 정보 저장 및 주문 상태 업데이트
            order.setOrderStatus(OrderEntity.OrderStatus.PAID);
            orderRepository.save(order); // 주문 상태 업데이트

            // PaymentEntity 생성 또는 업데이트
            Optional<PaymentEntity> existingPayment = paymentRepository.findByOrder_OrderId(order.getOrderId());
            PaymentEntity payment;

            if (existingPayment.isPresent()) {
                payment = existingPayment.get();
                payment.setImpUid(impUid);
                payment.setPaymentAmount(paymentData.getAmount());
                payment.setPaymentStatus(PaymentEntity.PaymentStatus.PAID);
                payment.setPaymentMethod(PaymentEntity.PaymentMethod.valueOf(paymentMethodUpperCase)); // [수정됨] null 체크된 변수 사용
                payment.setReceiptUrl(paymentData.getReceiptUrl());
                payment.setPaidAt(timestampToLocalDateTime(paymentData.getPaidAt().getTime() / 1000L));
                payment.setFailedAt(null); // 성공했으므로 실패 정보 초기화
                payment.setFailureReason(null);
            } else {
                payment = PaymentEntity.builder()
                        .order(order)
                        .impUid(impUid)
                        .paymentAmount(paymentData.getAmount())
                        .paymentStatus(PaymentEntity.PaymentStatus.PAID)
                        .paymentMethod(PaymentEntity.PaymentMethod.valueOf(paymentMethodUpperCase)) // [수정됨] null 체크된 변수 사용
                        .receiptUrl(paymentData.getReceiptUrl())
                        .paidAt(timestampToLocalDateTime(paymentData.getPaidAt().getTime() / 1000L))
                        .build();
            }

            PaymentEntity savedPayment = paymentRepository.save(payment);
            return PaymentResponseDTO.from(savedPayment);

        } catch (Exception e) {
            log.error("결제 콜백 처리 중 오류 발생: impUid={}, merchantUid={}", impUid, merchantUid, e);
            // 오류 발생 시 주문 상태를 FAILED 또는 PENDING 으로 유지할 수 있음 (선택)
            // 필요하다면 이미 생성된 주문의 상태를 실패로 변경하거나, 롤백 처리
            orderRepository.findByMerchantUid(merchantUid).ifPresent(order -> {
                order.setOrderStatus(OrderEntity.OrderStatus.FAILED); // 오류 발생 시 주문 실패 처리
                orderRepository.save(order);
            });
            throw new RuntimeException("결제 처리 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 특정 결제 정보 상세 조회
     *
     * @param paymentId 결제 고유 ID
     * @param memberId  요청한 회원의 ID (보안 검사)
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
     * 특정 회원의 모든 결제 내역 조회
     *
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
     * 결제 취소
     *
     * @param paymentId     취소할 결제 고유 ID
     * @param memberId      요청한 회원의 ID (보안 검사)
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

        // 1. 아임포트 API를 통한 결제 취소 요청
        try {
            // 전액 취소 또는 부분 취소 처리
            com.siot.IamportRestClient.request.CancelData cancelData;
            if (cancelRequest.getCancelRequestAmount() != null && cancelRequest.getCancelRequestAmount().compareTo(payment.getPaymentAmount()) < 0) {
                // 부분 취소
                if (cancelRequest.getChecksum() == null || cancelRequest.getChecksum().compareTo(cancelRequest.getCancelRequestAmount().toString()) != 0) {
                    throw new IllegalArgumentException("체크섬 불일치: 부분 취소 금액 검증 실패");
                }
                cancelData = new com.siot.IamportRestClient.request.CancelData(
                        payment.getImpUid(),
                        true, // 부분 취소 여부
                        cancelRequest.getCancelRequestAmount() // 취소 금액
                );
            } else {
                // 전액 취소
                cancelData = new com.siot.IamportRestClient.request.CancelData(payment.getImpUid(), false);
            }

            cancelData.setReason(cancelRequest.getReason() != null ? cancelRequest.getReason() : "고객 요청");

            IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
            Payment canceledPaymentData = cancelResponse.getResponse();

            if (canceledPaymentData == null) {
                throw new RuntimeException("아임포트에서 결제 취소 실패 또는 응답 없음.");
            }
            log.info("아임포트 결제 취소 응답: {}", objectMapper.writeValueAsString(canceledPaymentData));

            // 2. DB 상태 업데이트
            payment.setPaymentStatus(PaymentEntity.PaymentStatus.CANCELLED);
            payment.getOrder().setOrderStatus(OrderEntity.OrderStatus.CANCELLED); // 연관된 주문 상태도 취소로 변경
            payment.setFailureReason(cancelRequest.getReason()); // 취소 사유 저장 (optional)
            payment.setPaidAt(null); // 취소되었으므로 결제 완료 시간 초기화 (or 새로운 필드 추가)
            payment.setFailedAt(LocalDateTime.now()); // 취소 일시를 failed_at에 저장 (혹은 별도 cancel_at 필드)

            paymentRepository.save(payment);
            orderRepository.save(payment.getOrder()); // 주문 상태 저장

            return PaymentResponseDTO.from(payment);

        } catch (Exception e) {
            log.error("결제 취소 중 오류 발생: paymentId={}", paymentId, e);
            throw new RuntimeException("결제 취소 중 오류가 발생했습니다.", e);
        }
    }

    // 금액 불일치 시 아임포트 결제 취소 (백엔드에서 자동 취소)
    private void cancelPaymentOnMismatch(String impUid, BigDecimal orderAmount, BigDecimal actualPaidAmount, Long orderId) {
        log.warn("결제 금액 불일치 감지. imp_uid: {}, 주문 금액: {}, 실제 결제 금액: {}", impUid, orderAmount, actualPaidAmount);
        try {
            com.siot.IamportRestClient.request.CancelData cancelData = new com.siot.IamportRestClient.request.CancelData(impUid, false); // 전액 취소
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
}
