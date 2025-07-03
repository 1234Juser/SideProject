import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/order';

/**
 * 주문을 생성하는 API를 호출합니다.
 * @param {object} orderRequestDTO - 주문 요청 데이터 (orderItems, pickupAt 포함)
 * @param {string} accessToken - 사용자 인증 토큰
 * @returns {Promise<object>} - 주문 성공 시 응답 데이터
 */
export const placeOrder = async (orderRequestDTO, accessToken) => {
    // [DEBUG] OrderService로 전달된 accessToken 값 확인
    console.log('OrderService: placeOrder로 전달된 accessToken:', accessToken ? '토큰 존재' : '토큰 없음'); // 토큰 값 마스킹
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
        console.log('OrderService: 주문 생성 성공:', response.data);
        return response.data;
    } catch (error) {
        // [DEBUG] 에러 발생 시 더 상세한 정보 로깅
        console.error('OrderService: 주문 실패:', error);
        if (error.response) {
            console.error('OrderService: 에러 응답 데이터:', error.response.data);
            console.error('OrderService: 에러 응답 상태:', error.response.status);
            console.error('OrderService: 에러 응답 헤더:', error.response.headers); // 추가
        } else if (error.request) {
            console.error('OrderService: 에러 요청 (응답 없음):', error.request);
        } else {
            console.error('OrderService: 에러 메시지:', error.message);
        }
        throw error; // 에러를 호출자에게 다시 던집니다.
    }
};