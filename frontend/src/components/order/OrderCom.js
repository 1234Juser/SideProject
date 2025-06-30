import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { placeOrder } from '../../service/OrderService';
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
    const { auth } = useAuth();

    const [orderItemsToDisplay, setOrderItemsToDisplay] = useState([]);
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!auth.isAuthenticated) {
            alert('로그인이 필요합니다.');
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
        } else if (initialOrderItems.length > 0) {
            const formattedItems = initialOrderItems.map(item => ({
                menuId: item.menu.menuId,
                menuName: item.menu.menuName,
                quantity: item.quantity,
                pricePerItem: item.menu.menuPrice,
                imageUrl: item.menu.menuImageUrl
            }));
            setOrderItemsToDisplay(formattedItems);
        } else {
            alert('주문할 상품 정보가 없습니다.');
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

    }, [location.state, auth.isAuthenticated, navigate]);

    const calculateTotalAmount = () => {
        return orderItemsToDisplay.reduce((total, item) => total + (item.pricePerItem * item.quantity), 0);
    };

    const handlePlaceOrder = async () => {
        setErrorMessage('');

        if (!pickupDate || !pickupTime) {
            setErrorMessage('픽업 날짜와 시간을 선택해주세요.');
            return;
        }

        const pickupDateTimeString = `${pickupDate}T${pickupTime}:00`;
        const pickupAt = new Date(pickupDateTimeString);
        const now = new Date();

        if (pickupAt <= now) {
            setErrorMessage('픽업 시간은 현재 시간보다 미래여야 합니다.');
            return;
        }

        if (orderItemsToDisplay.length === 0) {
            setErrorMessage('주문할 상품이 없습니다.');
            return;
        }

        const orderItemsDTO = orderItemsToDisplay.map(item => ({
            menuId: item.menuId,
            quantity: item.quantity
        }));

        const orderRequestDTO = {
            orderItems: orderItemsDTO,
            pickupAt: pickupDateTimeString
        };

        try {
            const response = await placeOrder(orderRequestDTO, auth.accessToken);
            alert('주문이 성공적으로 접수되었습니다!');
            navigate('/order-success', { state: { orderResponse: response } });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
                    auth.logout();
                    navigate('/login');
                } else if (error.response.data && error.response.data.message) {
                    setErrorMessage(`주문 실패: ${error.response.data.message}`);
                } else {
                    setErrorMessage('주문에 실패했습니다. 다시 시도해주세요.');
                }
            } else {
                setErrorMessage('네트워크 오류 또는 서버 응답이 없습니다.');
            }
        }
    };

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
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </PickupTimeSelection>

            <PlaceOrderButton onClick={handlePlaceOrder}>결제하기</PlaceOrderButton>
        </OrderContainer>
    );
}

export default OrderCom;