import axios from "axios";

const path = `http://localhost:8080`;

export const signupMember = async (memberData) => {
    try {
        const response = await axios.post(`${path}/api/members/signup`, memberData);

        console.log('응답 확인 : ', response);

        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('회원가입 중 오류가 발생했습니다.');
    }
};