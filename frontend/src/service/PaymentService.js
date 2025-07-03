import axios from 'axios';

const BASE_URL = '/api/payments'; // 백엔드 결제 컨트롤러 기본 URL

const PaymentService = {
    /**
     * 포트원(아임포트) 결제 성공 후 백엔드에 결제 정보를 검증하도록 요청합니다.
     * @param {object} paymentData 아임포트 콜백으로부터 받은 결제 데이터 (imp_uid, merchant_uid 등)
     * @param {string} accessToken 사용자 인증 토큰
     */
    processPaymentCallback: async (paymentData, accessToken) => {
        console.log('PaymentService: processPaymentCallback - accessToken 전송 여부:', accessToken ? '토큰 존재' : '토큰 없음'); // 추가
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
            console.log('PaymentService: processPaymentCallback 성공:', response.data); // 추가
            return response.data;
        } catch (error) {
            console.error('PaymentService: 결제 콜백 처리 실패:', error);
            if (error.response) { // 추가
                console.error('PaymentService: 에러 응답 데이터:', error.response.data);
                console.error('PaymentService: 에러 응답 상태:', error.response.status);
                console.error('PaymentService: 에러 응답 헤더:', error.response.headers);
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
        console.log(`PaymentService: getPaymentDetails (ID: ${paymentId}) - accessToken 전송 여부:`, accessToken ? '토큰 존재' : '토큰 없음'); // 추가
        try {
            const response = await axios.get(
                `${BASE_URL}/${paymentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(`PaymentService: 결제 상세 정보 조회 성공 (ID: ${paymentId}):`, response.data); // 추가
            return response.data;
        } catch (error) {
            console.error(`PaymentService: 결제 상세 정보 조회 실패 (ID: ${paymentId}):`, error);
            if (error.response) { // 추가
                console.error('PaymentService: 에러 응답 데이터:', error.response.data);
                console.error('PaymentService: 에러 응답 상태:', error.response.status);
                console.error('PaymentService: 에러 응답 헤더:', error.response.headers);
            }
            throw error;
        }
    },

    /**
     * 특정 회원의 모든 결제 내역 조회
     * @param {string} accessToken 사용자 인증 토큰
     */
    getPaymentsByMember: async (accessToken) => {
        console.log('PaymentService: getPaymentsByMember - accessToken 전송 여부:', accessToken ? '토큰 존재' : '토큰 없음'); // 추가
        try {
            const response = await axios.get(
                `${BASE_URL}/user`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log('PaymentService: 회원 결제 내역 조회 성공:', response.data); // 추가
            return response.data;
        } catch (error) {
            console.error('PaymentService: 회원 결제 내역 조회 실패:', error);
            if (error.response) { // 추가
                console.error('PaymentService: 에러 응답 데이터:', error.response.data);
                console.error('PaymentService: 에러 응답 상태:', error.response.status);
                console.error('PaymentService: 에러 응답 헤더:', error.response.headers);
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
        console.log(`PaymentService: cancelPayment (ID: ${paymentId}) - accessToken 전송 여부:`, accessToken ? '토큰 존재' : '토큰 없음'); // 추가
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
            console.log(`PaymentService: 결제 취소 성공 (ID: ${paymentId}):`, response.data); // 추가
            return response.data;
        } catch (error) {
            console.error(`PaymentService: 결제 취소 실패 (ID: ${paymentId}):`, error);
            if (error.response) { // 추가
                console.error('PaymentService: 에러 응답 데이터:', error.response.data);
                console.error('PaymentService: 에러 응답 상태:', error.response.status);
                console.error('PaymentService: 에러 응답 헤더:', error.response.headers);
            }
            throw error;
        }
    },
};

export default PaymentService;