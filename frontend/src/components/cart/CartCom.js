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

function CartCom({ cartItems, selectedCartItems, setSelectedCartItems }) {
    const { auth } = useAuth();
    const queryClient = useQueryClient(); // queryClient 초기화

    // 모든 장바구니 항목이 선택 해제되면 selectedCartItems를 초기화
    useEffect(() => {
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

    const handleRemoveItem = async (cartItemId) => {
        if (!window.confirm('선택하신 항목을 장바구니에서 삭제하시겠습니까?')) {
            return;
        }
        try {
            await removeCartItem(cartItemId, auth.accessToken);
            alert('장바구니 항목이 삭제되었습니다.');
            queryClient.invalidateQueries(['cartItems']); // 장바구니 목록 쿼리 무효화하여 데이터 다시 불러오기
        } catch (error) {
            console.error('장바구니 항목 삭제 실패:', error);
            alert('장바구니 항목 삭제에 실패했습니다.');
        }
    };

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
            // 수량이 0 이하면 삭제 처리
            handleRemoveItem(cartItemId);
            return;
        }
        try {
            await updateCartItemQuantity(cartItemId, newQuantity, auth.accessToken);
            queryClient.invalidateQueries(['cartItems']); // 장바구니 목록 쿼리 무효화하여 데이터 다시 불러오기
        } catch (error) {
            // console.error('장바구니 항목 수량 업데이트 실패:', error);
            alert('장바구니 항목 수량 업데이트에 실패했습니다.');
        }
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedCartItems.includes(item.cartItemId))
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

    return (
        <CartContainer>
            <CartHeader>나의 장바구니</CartHeader>
            <CartItemList>
                {cartItems.map((item) => (
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
                            <QuantityButton onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}>+</QuantityButton>
                            <QuantityButton onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}>-</QuantityButton>
                            <RemoveButton onClick={() => handleRemoveItem(item.cartItemId)}>삭제</RemoveButton>
                        </CartActions>
                    </CartItem>
                ))}
            </CartItemList>
            <CartTotal>
                선택된 상품 총 금액: {calculateTotal().toLocaleString()}원
            </CartTotal>
            <CheckoutButton
                onClick={() => alert(`총 ${selectedCartItems.length}개의 항목 결제 예정: ${calculateTotal().toLocaleString()}원`)}
                disabled={selectedCartItems.length === 0}
            >
                선택된 상품 구매하기
            </CheckoutButton>
        </CartContainer>
    );
}

export default CartCom;