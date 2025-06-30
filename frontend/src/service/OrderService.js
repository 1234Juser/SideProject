import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/order';

/**
 * 주문을 생성하는 API를 호출합니다.
 * @param {object} orderRequestDTO - 주문 요청 데이터 (orderItems, pickupAt 포함)
 * @param {string} accessToken - 사용자 인증 토큰
 * @returns {Promise<object>} - 주문 성공 시 응답 데이터
 */
export const placeOrder = async (orderRequestDTO, accessToken) => {
    try {
        const response = await axios.post(
            BASE_URL,
            orderRequestDTO,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('주문 실패:', error);
        throw error; // 에러를 호출자에게 다시 던집니다.
    }
};