import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/cart';

// 장바구니에 항목 추가 또는 기존 항목 수량 증가
export const addCartItem = async (menuId, quantity, accessToken) => {
    try {
        const response = await axios.post(
            API_BASE_URL,
            { menuId, quantity },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data; // CartItemResponseDTO 반환
    } catch (error) {
        console.error('장바구니 추가/수량 증가 실패:', error);
        throw error;
    }
};

// 특정 장바구니 항목 삭제
export const removeCartItem = async (menuId, accessToken) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/${menuId}`, // [수정됨] API_BASE_URL 사용
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log('장바구니 항목 삭제 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error('장바구니 항목 삭제 실패:', error);
        throw error;
    }
};

// 현재 사용자의 장바구니 목록 조회
export const fetchCartItems = async (accessToken) => {
    try {
        const response = await axios.get(API_BASE_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data; // List<CartItemResponseDTO> 반환
    } catch (error) {
        console.error('장바구니 목록 불러오기 실패:', error);
        throw error;
    }
};

// 장바구니 항목 수량 업데이트
export const updateCartItemQuantity = async (menuId, quantity, accessToken) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/${menuId}`, // [수정됨] API_BASE_URL 사용
            { quantity },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data; // 업데이트된 CartItemResponseDTO 반환
    } catch (error) {
        console.error('장바구니 항목 수량 업데이트 실패:', error);
        throw error;
    }
};
