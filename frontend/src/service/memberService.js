import axios from "axios";

const path = `http://localhost:8080`;

// 회원 가입
export const signupMember = async (memberData) => {
    try {
        const response = await axios.post(`${path}/api/members/signup`, memberData);

        console.log('응답 확인 : ', response.data);

        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('회원가입 중 오류가 발생했습니다.');
    }
};


// 로그인
export const loginMember = async (loginData) => {
    try {
        // console.log('loginData 확인 : ', loginData)
        const response = await axios.post(`${path}/api/members/login`, loginData);

        console.log('응답 확인:', response.data);

        return response.data;
        } catch (error) {
            throw error.response?.data || new Error('로그인에 실패했습니다.');
        }
}


// 회원 정보 조회 (현재 로그인된 사용자)
export const fetchMemberInfo = async (accessToken) => {
    try {
        const response = await axios.get(`${path}/api/members/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data
    } catch (error) {
        console.error("회원 정보 조회 실패:", error.response?.data || error.message);
        throw error.response?.data?.message || new Error('회원 정보를 불러오는데 실패했습니다.');
    }
};


// 회원 정보 수정 (닉네임, 전화번호, 비밀번호 등)
export const updateMemberInfo = async (accessToken, updatePayload) => {
    try {
        const response = await axios.patch(`${path}/api/members/m/{memberId}`, updatePayload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('회원 정보 수정 응답:', response.data);
        // 백엔드에서 ApiResponse 형태로 응답이 오므로, message 필드를 반환
        return response.data.message;
    } catch (error) {
        console.error("회원 정보 수정 실패:", error.response?.data || error.message);
        throw error.response?.data?.message || new Error('회원 정보 수정에 실패했습니다.');
    }
};