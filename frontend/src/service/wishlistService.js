import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/wishlist'; // 백엔드 찜 API 기본 URL

// 인증 헤더를 포함하는 axios 인스턴스 생성 또는 함수
const createAxiosInstance = (accessToken) => {
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken ? `Bearer ${accessToken}` : '' // 토큰이 있을 경우에만 추가
        },
        withCredentials: true // 세션 쿠키 등을 주고받을 경우 필요
    });
};

// 찜 등록 API 호출
export const addWishlist = async (menuId, accessToken) => {
    try {
        const instance = createAxiosInstance(accessToken);
        const response = await instance.post('', { menuId }); // baseURL이 설정되어 있으므로 빈 문자열
        return response.data; // 성공 시 찜 항목 정보 반환
    } catch (error) {
        // console.error('찜 등록 중 오류 발생:', error.response ? error.response.data : error.message);
        throw error; // 오류를 다시 던져서 호출하는 쪽에서 처리할 수 있도록 함
    }
};

// 찜 취소 API 호출
export const removeWishlist = async (menuId, accessToken) => {
    try {
        const instance = createAxiosInstance(accessToken);
        const response = await instance.delete(`/${menuId}`); // baseURL이 설정되어 있으므로 /menuId
        return response.data; // 성공 시 응답 데이터 (보통 204 No Content 이므로 데이터는 없을 수 있음)
    } catch (error) {
        // console.error('찜 취소 중 오류 발생:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// 찜 목록 조회 API 호출
export const fetchWishlists = async (accessToken) => {
    try {
        const instance = createAxiosInstance(accessToken);
        const response = await instance.get(''); // baseURL이 설정되어 있으므로 빈 문자열
        return response.data;
    } catch (error) {
        // console.error('찜 목록 조회 중 오류 발생:', error.response ? error.response.data : error.message);
        throw error;
    }
};