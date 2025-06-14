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
        const response = await axios.post(`${path}/api/members/login`, loginData);

        console.log('응답 확인:', response.data);

        return response.data;
        } catch (error) {
            throw error.response?.data || new Error('로그인에 실패했습니다.');
        }
}