import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { placeOrder } from '../../service/OrderService';
import PaymentService from '../../service/PaymentService';
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
    PickupTimeSelection,
    InputGroup,
    DateTimeInput,
    PlaceOrderButton,
    ErrorMessage
} from '../../style/order/OrderStyle';

function OrderCom() {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, logout, isAuthInitialized } = useAuth();

    const [orderItemsToDisplay, setOrderItemsToDisplay] = useState([]);
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isTimeConfirmed, setIsTimeConfirmed] = useState(false);

    useEffect(() => {
        if (!isAuthInitialized) {
            console.log('OrderCom: AuthContext 초기화 대기 중...'); // 추가
            return;
        }
        console.log('OrderCom: AuthContext 초기화 완료. 현재 인증 상태:', auth.isAuthenticated); // 추가

        if (!auth.isAuthenticated) {
            alert('로그인이 필요합니다.');
            console.log('OrderCom: 로그인 필요. 로그인 페이지로 리다이렉트.'); // 추가
            navigate('/login');
            return;
        }

        const initialOrderItems = location.state?.selectedItems || [];
        const singleMenuItem = location.state?.menu;
        const singleMenuQuantity = location.state?.quantity;

        if (singleMenuItem && singleMenuQuantity) {
            setOrderItemsToDisplay([{
                menuId: singleMenuItem.menuId,
                menuName: singleMenuItem.menuName,
                quantity: singleMenuQuantity,
                pricePerItem: singleMenuItem.menuPrice,
                imageUrl: singleMenuItem.menuImageUrl
            }]);
            console.log('OrderCom: 단일 메뉴 주문 항목 설정됨.'); // 추가
        } else if (initialOrderItems.length > 0) {
            const formattedItems = initialOrderItems.map(item => ({
                menuId: item.menu.menuId,
                menuName: item.menu.menuName,
                quantity: item.quantity,
                pricePerItem: item.menu.menuPrice,
                imageUrl: item.menu.menuImageUrl
            }));
            setOrderItemsToDisplay(formattedItems);
            console.log('OrderCom: 여러 메뉴 주문 항목 설정됨.'); // 추가
        } else {
            alert('주문할 상품 정보가 없습니다.');
            console.log('OrderCom: 주문할 상품 정보 없음. 홈 페이지로 리다이렉트.'); // 추가
            navigate('/');
        }

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setPickupDate(`${yyyy}-${mm}-${dd}`);

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        setPickupTime(`${hh}:${min}`);
        console.log(`OrderCom: 초기 픽업 날짜/시간 설정됨: ${yyyy}-${mm}-${dd} ${hh}:${min}`); // 추가

    }, [location.state, auth.isAuthenticated, navigate, isAuthInitialized]);

    const calculateTotalAmount = () => {
        return orderItemsToDisplay.reduce((total, item) => total + (item.pricePerItem * item.quantity), 0);
    };

    const handleTimeConfirm = () => {
        setErrorMessage('');
        if (!pickupDate || !pickupTime) {
            setErrorMessage('픽업 날짜와 시간을 선택해주세요.');
            console.warn('OrderCom: 픽업 날짜 또는 시간 선택 안됨.'); // 추가
            return;
        }
        const pickupDateTimeString = `${pickupDate}T${pickupTime}:00`;
        if (new Date(pickupDateTimeString) <= new Date()) {
            setErrorMessage('픽업 시간은 현재 시간보다 미래여야 합니다.');
            console.warn('OrderCom: 픽업 시간이 현재보다 이전임.'); // 추가
            return;
        }
        setIsTimeConfirmed(true);
        console.log(`OrderCom: 픽업 시간 확인 완료: ${pickupDate} ${pickupTime}`); // 추가
    };

    const handlePayment = async () => {
        setErrorMessage('');
        console.log('OrderCom: 결제 시작 버튼 클릭됨.'); // 추가

        if (!auth.accessToken) {
            alert('인증 토큰이 없습니다. 다시 로그인 해주세요.');
            console.error('OrderCom: auth.accessToken이 null 또는 undefined입니다. 로그아웃 처리.'); // 추가
            logout();
            navigate('/login');
            return;
        }
        console.log('OrderCom: accessToken 존재 확인됨. 주문 생성 시도.'); // 추가

        try {
            const orderItemsDTO = orderItemsToDisplay.map(item => ({
                menuId: item.menuId,
                quantity: item.quantity
            }));
            const orderRequestDTO = {
                orderItems: orderItemsDTO,
                pickupAt: `${pickupDate}T${pickupTime}:00`
            };
            console.log('OrderCom: orderRequestDTO:', orderRequestDTO); // 추가
            const orderResponse = await placeOrder(orderRequestDTO, auth.accessToken);
            console.log('OrderCom: 주문 생성 응답:', orderResponse); // 추가

            const { IMP } = window;
            IMP.init('imp47720710');
            const firstItemName = orderItemsToDisplay[0]?.menuName || '주문';
            const orderName = orderItemsToDisplay.length > 1
                ? `${firstItemName} 외 ${orderItemsToDisplay.length - 1}건`
                : firstItemName;

            console.log('OrderCom: 아임포트 결제 요청 데이터:', { // 추가
                pg: 'html5_inicis',
                pay_method: 'card',
                merchant_uid: orderResponse.merchantUid,
                name: orderName,
                amount: orderResponse.orderTotalAmount,
                buyer_email: auth.memberUsername,
                buyer_name: auth.memberNickname,
                buyer_tel: '010-0000-0000',
            });
            IMP.request_pay({
                pg: 'html5_inicis',
                pay_method: 'card',
                merchant_uid: orderResponse.merchantUid,
                name: orderName,
                amount: orderResponse.orderTotalAmount,
                buyer_email: auth.memberUsername,
                buyer_name: auth.memberNickname,
                buyer_tel: '010-0000-0000',
            }, async (rsp) => {
                console.log('OrderCom: 아임포트 결제 응답 (rsp):', rsp); // 추가
                if (rsp.success) {
                    try {
                        const paymentData = {
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid,
                        };
                        console.log('OrderCom: 결제 성공 후 백엔드 검증 요청 (paymentData):', paymentData); // 추가
                        const finalResponse = await PaymentService.processPaymentCallback(paymentData, auth.accessToken);
                        alert('결제가 성공적으로 완료되었습니다.');
                        console.log('OrderCom: 백엔드 결제 검증 및 처리 성공. 결제 성공 페이지로 이동.'); // 추가
                        navigate('/order-success', { state: { orderResponse: finalResponse } });
                    } catch (verifyError) {
                        const failMsg = verifyError.response?.data?.message || '알 수 없는 오류';
                        alert(`결제는 성공했으나 서버 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.\n사유: ${failMsg}`);
                        console.error('OrderCom: 결제 성공 후 서버 검증 중 오류 발생:', verifyError); // 추가
                        if (verifyError.response) { // 추가
                            console.error('OrderCom: 검증 오류 응답 데이터:', verifyError.response.data);
                            console.error('OrderCom: 검증 오류 응답 상태:', verifyError.response.status);
                            console.error('OrderCom: 검증 오류 응답 헤더:', verifyError.response.headers);
                        }
                    }
                } else {
                    alert(`결제에 실패했습니다. 에러: ${rsp.error_msg}`);
                    setErrorMessage(`결제 실패: ${rsp.error_msg}`);
                    console.error('OrderCom: 아임포트 결제 실패:', rsp.error_msg); // 추가
                }
            });
        } catch (error) {
            console.error('OrderCom: 주문 생성 또는 결제 처리 중 예외 발생:', error); // 추가
            if (error.response && error.response.status === 401) {
                setErrorMessage('인증이 만료되었습니다. 다시 로그인해주세요.');
                console.error('OrderCom: 401 Unauthorized 응답 수신. 토큰 만료 또는 유효하지 않음. 로그아웃 처리.'); // 추가
                console.error('OrderCom: 401 에러 응답 데이터:', error.response.data); // 추가
                console.error('OrderCom: 401 에러 응답 헤더:', error.response.headers); // 추가
                logout();
                navigate('/login');
            } else {
                setErrorMessage(`주문 생성 실패: ${error.response?.data?.message || '서버 오류'}`);
                console.error('OrderCom: 주문 생성/처리 기타 오류:', error.response?.data || error.message); // 추가
            }
        }
    };

    if (!isAuthInitialized) {
        return <div>페이지를 불러오는 중입니다...</div>;
    }

    return (
        <OrderContainer>
            <OrderHeader>주문 확인 및 픽업 시간 선택</OrderHeader>

            <OrderSummary>
                <h2>주문 상품</h2>
                <OrderItemList>
                    {orderItemsToDisplay.map((item, index) => (
                        <OrderItem key={index}>
                            {item.imageUrl && <OrderItemImage src={`http://localhost:8080${item.imageUrl}`} alt={item.menuName} />}
                            <OrderItemName>{item.menuName}</OrderItemName>
                            <OrderItemQuantityPrice>
                                수량: {item.quantity}개, 가격: {(item.pricePerItem * item.quantity).toLocaleString()}원
                            </OrderItemQuantityPrice>
                        </OrderItem>
                    ))}
                </OrderItemList>
                <OrderTotal>
                    총 결제 금액: {calculateTotalAmount().toLocaleString()}원
                </OrderTotal>
            </OrderSummary>

            <PickupTimeSelection>
                <h2>픽업 시간 선택</h2>
                {!isTimeConfirmed ? (
                    <>
                        <InputGroup>
                            <DateTimeInput
                                type="date"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <DateTimeInput
                                type="time"
                                value={pickupTime}
                                onChange={(e) => setPickupTime(e.target.value)}
                            />
                        </InputGroup>
                        <PlaceOrderButton onClick={handleTimeConfirm}>시간 선택 완료</PlaceOrderButton>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <p><strong>선택된 픽업 시간:</strong> {pickupDate} {pickupTime}</p>
                        <button onClick={() => { setIsTimeConfirmed(false); setErrorMessage(''); }}>시간 다시 선택</button>
                    </div>
                )}
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </PickupTimeSelection>

            {isTimeConfirmed && (
                <PlaceOrderButton onClick={handlePayment}>결제하기</PlaceOrderButton>
            )}
        </OrderContainer>
    );
}

export default OrderCom;