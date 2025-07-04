import React from 'react';
import {
    PaymentHistoryContainer,
    PaymentHistoryHeader,
    PaymentList,
    PaymentItem,
    PaymentDetail,
    PaymentAmount,
    PaymentStatus,
    NoPaymentMessage,
    ErrorMessageStyled,
    ActionButtonContainer,
    CancelButton,
    CheckboxContainer,
    StyledCheckbox
} from '../../style/payment/PaymentStyle';

function PaymentCom({
                        payments,
                        error,
                        selectedPaymentIds,
                        handleCheckboxChange,
                        handleCancelSelectedPayments,
                        handlePaymentItemClick,
                        loading
                    }) {
    // 로딩 중일 때 표시할 UI
    if (loading) {
        return (
            <PaymentHistoryContainer>
                <PaymentHistoryHeader>결제 내역을 불러오는 중입니다...</PaymentHistoryHeader>
            </PaymentHistoryContainer>
        );
    }

    return (
        <PaymentHistoryContainer>
            <PaymentHistoryHeader>나의 결제 내역</PaymentHistoryHeader>

            {/* 에러 메시지 표시 */}
            {error && <ErrorMessageStyled>{error}</ErrorMessageStyled>}

            {/* 결제 내역이 없거나 에러가 없을 때 메시지 표시 */}
            {payments.length === 0 && !error ? (
                <NoPaymentMessage>결제 내역이 없습니다.</NoPaymentMessage>
            ) : (
                <>
                    <PaymentList>
                        {payments.map((payment) => {
                            // 'PAID' 또는 'PENDING' 상태의 결제만 취소 가능하도록 설정
                            const isCancellable = payment.paymentStatus === 'PAID' || payment.paymentStatus === 'PENDING';
                            return (
                                <PaymentItem
                                    key={payment.paymentId}
                                    // 결제 항목 클릭 시 상세 페이지로 이동
                                    onClick={() => handlePaymentItemClick(payment.paymentId)}
                                >
                                    {/* 체크박스 컨테이너 (클릭 이벤트 버블링 방지) */}
                                    <CheckboxContainer onClick={(e) => e.stopPropagation()}>
                                        <StyledCheckbox
                                            type="checkbox"
                                            checked={selectedPaymentIds.has(payment.paymentId)}
                                            onChange={() => handleCheckboxChange(payment.paymentId)}
                                            disabled={!isCancellable} // 취소 불가능한 항목은 체크박스 비활성화
                                        />
                                        <PaymentDetail><strong>결제 ID:</strong> {payment.paymentId}</PaymentDetail>
                                    </CheckboxContainer>
                                    <PaymentDetail><strong>거래 번호:</strong> {payment.impUid}</PaymentDetail>
                                    <PaymentAmount><strong>결제 금액:</strong> {payment.paymentAmount?.toLocaleString()}원</PaymentAmount>
                                    <PaymentStatus status={payment.paymentStatus}>
                                        <strong>상태:</strong> {payment.paymentStatus}
                                    </PaymentStatus>
                                    <PaymentDetail><strong>결제 수단:</strong> {payment.paymentMethod}</PaymentDetail>
                                    <PaymentDetail>
                                        <strong>결제일:</strong> {payment.paidAt ? new Date(payment.paidAt).toLocaleString('ko-KR', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit', hour12: false
                                    }) : 'N/A'}
                                    </PaymentDetail>
                                    {payment.receiptUrl && (
                                        <PaymentDetail>
                                            <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
                                                영수증 보기
                                            </a>
                                        </PaymentDetail>
                                    )}
                                    {payment.failureReason && (
                                        <PaymentDetail style={{ color: '#dc3545' }}>
                                            <strong>실패 사유:</strong> {payment.failureReason}
                                        </PaymentDetail>
                                    )}
                                </PaymentItem>
                            );
                        })}
                    </PaymentList>
                    <ActionButtonContainer>
                        <CancelButton
                            onClick={handleCancelSelectedPayments}
                            disabled={selectedPaymentIds.size === 0} // 선택된 항목이 없으면 버튼 비활성화
                        >
                            선택된 결제 취소
                        </CancelButton>
                    </ActionButtonContainer>
                </>
            )}
        </PaymentHistoryContainer>
    );
}

export default PaymentCom;
