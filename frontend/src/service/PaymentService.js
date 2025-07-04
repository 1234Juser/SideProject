import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/payments';

const PaymentService = {
    /**
     * 포트원(아임포트) 결제 성공 후 백엔드에 결제 정보를 검증하도록 요청합니다.
     * @param {object} paymentData 아임포트 콜백으로부터 받은 결제 데이터 (imp_uid, merchant_uid 등)
     * @param {string} accessToken 사용자 인증 토큰
     */
    processPaymentCallback: async (paymentData, accessToken) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/callback`,
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {

            }
            throw error;
        }
    },

    /**
     * 특정 결제 정보 상세 조회
     * @param {Long} paymentId 결제 고유 ID
     * @param {string} accessToken 사용자 인증 토큰
     */
    getPaymentDetails: async (paymentId, accessToken) => {
        console.log(`PaymentService: getPaymentDetails (ID: ${paymentId}) - accessToken 전송 여부:`, accessToken ? '토큰 존재' : '토큰 없음');
        try {
            const response = await axios.get(
                `${BASE_URL}/${paymentId}`,
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
    },

    /**
     * 특정 회원의 모든 결제 내역 조회
     * @param {string} accessToken 사용자 인증 토큰
     */
    getPaymentsByMember: async (accessToken) => {
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
    },

    /**
     * [추가됨] 관리자용: 모든 결제 내역 조회 (날짜 필터링 포함)
     * @param {string} accessToken 관리자 인증 토큰
     * @param {string} date (선택 사항) 조회할 날짜 (YYYY-MM-DD 형식)
     */
    getAllPaymentsForAdmin: async (accessToken, date = null) => {
        let url = `${BASE_URL}/admin/all`;
        if (date) {
            url += `?date=${date}`;
        }
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            if (error.response) {

            }
            throw error;
        }
    },

    /**
     * 결제 취소 요청
     * @param {Long} paymentId 취소할 결제 고유 ID
     * @param {object} cancelRequestDTO 취소 요청 데이터 (reason, cancelRequestAmount 등)
     * @param {string} accessToken 사용자 인증 토큰
     */
    cancelPayment: async (paymentId, cancelRequestDTO, accessToken) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/${paymentId}/cancel`,
                cancelRequestDTO,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {

            }
            throw error;
        }
    },
};
export default PaymentService;
