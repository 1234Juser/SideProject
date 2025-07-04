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
        console.log('OrderService: 주문 생성 성공:', response.data);
        return response.data;
    } catch (error) {
        // [DEBUG] 에러 발생 시 더 상세한 정보 로깅
        if (error.response) {
        } else if (error.request) {
        } else {
        }
        throw error; // 에러를 호출자에게 다시 던집니다.
    }
};

/**
 * 특정 주문의 상세 정보를 조회하는 API를 호출합니다.
 * @param {Long} orderId - 조회할 주문의 ID
 * @param {string} accessToken - 사용자 인증 토큰
 * @returns {Promise<object>} - 주문 상세 정보 응답 데이터 (OrderResponseDTO)
 */
export const getOrderDetails = async (orderId, accessToken) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {

        }
        throw error;
    }
};

/**
 * 특정 회원의 모든 주문 내역을 조회하는 API를 호출합니다.
 * @param {string} accessToken - 사용자 인증 토큰
 * @returns {Promise<Array<object>>} - 주문 내역 리스트 응답 데이터 (List<OrderResponseDTO>)
 */
export const getOrdersByMember = async (accessToken) => { // [추가됨] export 추가
    try {
        const response = await axios.get(
            `${BASE_URL}/user`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {

        }
        throw error;
    }
};
