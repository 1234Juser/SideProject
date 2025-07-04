import React from 'react';
import {
    PaymentDetailContainer,
    PaymentDetailHeader,
    DetailSection,
    DetailItem,
    OrderItemSection,
    OrderItemTitle,
    OrderItemListStyled,
    OrderItemStyled,
    OrderItemImageStyled,
    OrderItemDetails,
    OrderItemNameStyled,
    OrderItemQuantityPriceStyled,
    BackButton,
    PaymentStatusDetail
} from '../../style/payment/PaymentDetailStyle';
import { ErrorMessage } from '../../style/order/OrderStyle';

// PaymentDetailCom 컴포넌트는 props를 통해 데이터와 핸들러 함수를 받습니다.
function PaymentDetailCom({ paymentDetails, orderDetails, error, navigate }) {
    if (error) {
        return (
            <PaymentDetailContainer>
                <PaymentDetailHeader>오류 발생</PaymentDetailHeader>
                <ErrorMessage>{error}</ErrorMessage>
                <BackButton onClick={() => navigate('/my-page/payments')}>목록으로 돌아가기</BackButton>
            </PaymentDetailContainer>
        );
    }

    if (!paymentDetails) {
        return (
            <PaymentDetailContainer>
                <PaymentDetailHeader>결제 상세 정보를 찾을 수 없습니다.</PaymentDetailHeader>
                <BackButton onClick={() => navigate('/mypage/payment')}>목록으로 돌아가기</BackButton>
            </PaymentDetailContainer>
        );
    }

    return (
        <PaymentDetailContainer>
            <PaymentDetailHeader>결제 상세 정보</PaymentDetailHeader>

            <DetailSection>
                <DetailItem><strong>결제 ID:</strong> {paymentDetails.paymentId}</DetailItem>
                <DetailItem><strong>주문 ID:</strong> {paymentDetails.orderId}</DetailItem>
                <DetailItem><strong>거래 번호 (imp_uid):</strong> {paymentDetails.impUid}</DetailItem>
                <DetailItem><strong>결제 금액:</strong> {paymentDetails.paymentAmount?.toLocaleString()}원</DetailItem>
                <PaymentStatusDetail status={paymentDetails.paymentStatus}>
                    <strong>결제 상태:</strong> {paymentDetails.paymentStatus}
                </PaymentStatusDetail>
                <DetailItem><strong>결제 수단:</strong> {paymentDetails.paymentMethod}</DetailItem>
                <DetailItem>
                    <strong>결제일:</strong> {paymentDetails.paidAt ? new Date(paymentDetails.paidAt).toLocaleString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', hour12: false
                }) : 'N/A'}
                </DetailItem>
                {paymentDetails.receiptUrl && (
                    <DetailItem>
                        <a href={paymentDetails.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
                            영수증 보기
                        </a>
                    </DetailItem>
                )}
                {paymentDetails.failureReason && (
                    <DetailItem style={{ color: '#dc3545' }}>
                        <strong>실패 사유:</strong> {paymentDetails.failureReason}
                    </DetailItem>
                )}
            </DetailSection>

            {/* 주문 상품 내역 표시 */}
            {orderDetails && orderDetails.orderItems && orderDetails.orderItems.length > 0 && (
                <OrderItemSection>
                    <OrderItemTitle>주문 상품 내역</OrderItemTitle>
                    <OrderItemListStyled>
                        {orderDetails.orderItems.map((item, index) => (
                            <OrderItemStyled key={index}>
                                {item.imageUrl && <OrderItemImageStyled src={`http://localhost:8080${item.imageUrl}`} alt={item.menuName} />}
                                <OrderItemDetails>
                                    <OrderItemNameStyled>{item.menuName}</OrderItemNameStyled>
                                    <OrderItemQuantityPriceStyled>
                                        수량: {item.quantity}개, 단가: {item.priceAtPurchase?.toLocaleString()}원, 총: {(item.priceAtPurchase * item.quantity)?.toLocaleString()}원
                                    </OrderItemQuantityPriceStyled>
                                </OrderItemDetails>
                            </OrderItemStyled>
                        ))}
                    </OrderItemListStyled>
                </OrderItemSection>
            )}

            <BackButton onClick={() => navigate('/mypage/payment')}>목록으로 돌아가기</BackButton>
        </PaymentDetailContainer>
    );
}

export default PaymentDetailCom;
