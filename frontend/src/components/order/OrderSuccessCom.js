import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    OrderContainer,
    OrderHeader,
    OrderSummary,
    OrderItemList,
    OrderItem,
    OrderItemImage,
    OrderItemName,
    OrderItemQuantityPrice,
    OrderTotal,
    PlaceOrderButton,
    ErrorMessage
} from '../../style/order/OrderStyle';


function OrderSuccessCom() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderResponse, setOrderResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // location.state에서 orderResponse 데이터를 가져옵니다.
        if (location.state && location.state.orderResponse) {
            setOrderResponse(location.state.orderResponse);
            setLoading(false);
            console.log('OrderSuccess: 결제 완료 데이터 수신:', location.state.orderResponse);
        } else {
            // 데이터가 없는 경우 (예: 직접 URL로 접근)
            setError('결제 완료 정보를 찾을 수 없습니다. 다시 시도해주세요.');
            setLoading(false);
            console.warn('OrderSuccess: 결제 완료 데이터가 location.state에 없습니다.');
            // 3초 후 메인 페이지로 리다이렉트
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(timer); // 클린업 함수
        }
    }, [location.state, navigate]);

    // 로딩 중일 때 표시할 내용
    if (loading) {
        return (
            <OrderContainer>
                <OrderHeader>결제 정보를 불러오는 중입니다...</OrderHeader>
            </OrderContainer>
        );
    }

    // 에러 발생 시 표시할 내용
    if (error) {
        return (
            <OrderContainer>
                <OrderHeader>오류 발생</OrderHeader>
                <ErrorMessage>{error}</ErrorMessage>
                <PlaceOrderButton onClick={() => navigate('/')}>홈으로 돌아가기</PlaceOrderButton>
            </OrderContainer>
        );
    }

    // 결제 정보가 없을 경우 (데이터 로딩 실패 후)
    if (!orderResponse) {
        return (
            <OrderContainer>
                <OrderHeader>결제 정보를 찾을 수 없습니다.</OrderHeader>
                <PlaceOrderButton onClick={() => navigate('/')}>홈으로 돌아가기</PlaceOrderButton>
            </OrderContainer>
        );
    }

    // 모든 정보가 로드되면 결제 완료 내역을 표시
    return (
        <OrderContainer>
            <OrderHeader>결제 완료!</OrderHeader>
            <OrderSummary>
                <h2>주문 상세 정보</h2>
                <p><strong>주문 번호:</strong> {orderResponse.orderId}</p>
                <p><strong>거래 번호:</strong> {orderResponse.merchantUid}</p>
                <p><strong>주문 상태:</strong> {orderResponse.orderStatus}</p>
                <p><strong>픽업 예정 시간:</strong> {orderResponse.pickupAt ? new Date(orderResponse.pickupAt).toLocaleString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', hour12: false
                }) : '정보 없음'}</p>
                <p><strong>주문 일시:</strong> {orderResponse.createdAt ? new Date(orderResponse.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', hour12: false
                }) : '정보 없음'}</p>
                <OrderTotal>
                    총 결제 금액: {orderResponse.orderTotalAmount?.toLocaleString()}원
                </OrderTotal>
            </OrderSummary>

            <OrderSummary>
                <h2>주문 상품 내역</h2>
                <OrderItemList>
                    {orderResponse.orderItems && orderResponse.orderItems.map((item, index) => (
                        <OrderItem key={index}>
                            <OrderItemImage src={item.imageUrl} alt={item.menuName} />
                            <OrderItemName>{item.menuName}</OrderItemName>
                            <OrderItemQuantityPrice>
                                수량: {item.quantity}개, 단가: {item.priceAtPurchase?.toLocaleString()}원, 총: {(item.priceAtPurchase * item.quantity)?.toLocaleString()}원
                            </OrderItemQuantityPrice>
                        </OrderItem>
                    ))}
                </OrderItemList>
            </OrderSummary>

            <PlaceOrderButton onClick={() => navigate('/')}>홈으로 돌아가기</PlaceOrderButton>
            {/* 필요하다면 주문 내역 페이지로 가는 버튼 추가 */}
            {/* <PlaceOrderButton onClick={() => navigate('/my-orders')}>내 주문 내역 보기</PlaceOrderButton> */}
        </OrderContainer>
    );
}
export default OrderSuccessCom;
