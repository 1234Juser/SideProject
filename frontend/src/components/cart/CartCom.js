import React, { useEffect } from 'react';
import {
    CartContainer,
    CartHeader,
    CartItemList,
    CartItem,
    CartItemDetails,
    CartItemImage,
    CartItemName,
    CartItemQuantity,
    CartItemPrice,
    CartActions,
    RemoveButton,
    QuantityButton,
    CheckoutButton,
    CartTotal,
    NoCartItems
} from "../../style/cart/CartStyle";
import { removeCartItem, updateCartItemQuantity } from '../../service/CartService';
import { useAuth } from '../../utils/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import {useNavigate} from "react-router-dom";

function CartCom({ cartItems, selectedCartItems, setSelectedCartItems }) {
    const { auth } = useAuth();
    const queryClient = useQueryClient(); // queryClient 초기화
    const navigate = useNavigate();

    // 모든 장바구니 항목이 선택 해제되면 selectedCartItems를 초기화
    useEffect(() => {
        // [수정됨] selectedCartItems에 저장된 ID가 이제 menuId가 될 것이므로,
        // cartItems의 menuId를 기준으로 필터링 로직을 변경해야 할 수 있습니다.
        // 현재는 cartItemId를 기준으로 하므로, 이 부분은 추후 필요시 조정합니다.
        if (selectedCartItems.length > 0 && !cartItems.some(item => selectedCartItems.includes(item.cartItemId))) {
            setSelectedCartItems([]);
        }
    }, [cartItems, selectedCartItems, setSelectedCartItems]);

    const handleCheckboxChange = (cartItemId) => {
        setSelectedCartItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(cartItemId)) {
                return prevSelectedItems.filter((id) => id !== cartItemId);
            } else {
                return [...prevSelectedItems, cartItemId];
            }
        });
    };

    const handleRemoveItem = async (menuId) => { // [수정됨] cartItemId 대신 menuId를 인자로 받음
        if (!window.confirm('선택하신 항목을 장바구니에서 삭제하시겠습니까?')) {
            return;
        }
        try {
            await removeCartItem(menuId, auth.accessToken); // [수정됨] menuId 전달
            alert('장바구니 항목이 삭제되었습니다.');
            queryClient.invalidateQueries(['cartItems']); // 장바구니 목록 쿼리 무효화하여 데이터 다시 불러오기
        } catch (error) {
            console.error('장바구니 항목 삭제 실패:', error);
            alert('장바구니 항목 삭제에 실패했습니다.');
        }
    };

    const handleUpdateQuantity = async (menuId, newQuantity) => { // [수정됨] cartItemId 대신 menuId를 인자로 받음
        if (newQuantity <= 0) {
            // 수량이 0 이하면 삭제 처리
            handleRemoveItem(menuId); // [수정됨] menuId 전달
            return;
        }
        try {
            await updateCartItemQuantity(menuId, newQuantity, auth.accessToken); // [수정됨] menuId 전달
            queryClient.invalidateQueries(['cartItems']); // 장바구니 목록 쿼리 무효화하여 데이터 다시 불러오기
        } catch (error) {
            alert('장바구니 항목 수량 업데이트에 실패했습니다.');
        }
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedCartItems.includes(item.cartItemId)) // [유지] 체크박스는 여전히 cartItemId를 사용
            .reduce((total, item) => total + (item.menu.menuPrice * item.quantity), 0);
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <CartContainer>
                <CartHeader>나의 장바구니</CartHeader>
                <NoCartItems>장바구니에 담긴 메뉴가 없습니다.</NoCartItems>
            </CartContainer>
        );
    }

    const handleCheckout = () => {
        if (selectedCartItems.length === 0) {
            alert('구매할 상품을 하나 이상 선택해주세요.');
            return;
        }

        // 선택된 장바구니 항목들만 필터링
        const itemsToOrder = cartItems.filter(item =>
            selectedCartItems.includes(item.cartItemId)
        );

        // OrderCom으로 선택된 상품 정보와 함께 이동
        navigate('/order-confirm', { state: { selectedItems: itemsToOrder } });
    };


    return (
        <CartContainer>
            <CartHeader>나의 장바구니</CartHeader>
            <CartItemList>
                {cartItems.map((item) => (
                    // key는 여전히 Redis의 고유 ID인 item.cartItemId를 사용하는 것이 적절합니다.
                    <CartItem key={item.cartItemId}>
                        <input
                            type="checkbox"
                            checked={selectedCartItems.includes(item.cartItemId)}
                            onChange={() => handleCheckboxChange(item.cartItemId)}
                            style={{ marginRight: '10px' }}
                        />
                        <CartItemImage src={`http://localhost:8080${item.menu.menuImageUrl}`} alt={item.menu.menuName} />
                        <CartItemDetails>
                            <CartItemName>{item.menu.menuName}</CartItemName>
                            <CartItemQuantity>수량: {item.quantity}</CartItemQuantity>
                            <CartItemPrice>{(item.menu.menuPrice * item.quantity).toLocaleString()}원</CartItemPrice>
                        </CartItemDetails>
                        <CartActions>
                            {/* [수정됨] item.cartItemId 대신 item.menu.menuId 전달 */}
                            <QuantityButton onClick={() => handleUpdateQuantity(item.menu.menuId, item.quantity + 1)}>+</QuantityButton>
                            <QuantityButton onClick={() => handleUpdateQuantity(item.menu.menuId, item.quantity - 1)}>-</QuantityButton>
                            {/* [수정됨] item.cartItemId 대신 item.menu.menuId 전달 */}
                            <RemoveButton onClick={() => handleRemoveItem(item.menu.menuId)}>삭제</RemoveButton>
                        </CartActions>
                    </CartItem>
                ))}
            </CartItemList>
            <CartTotal>
                선택된 상품 총 금액: {calculateTotal().toLocaleString()}원
            </CartTotal>
            <CheckoutButton
                onClick={handleCheckout}
                disabled={selectedCartItems.length === 0}
            >
                선택된 상품 구매하기
            </CheckoutButton>
        </CartContainer>
    );
}

export default CartCom;
