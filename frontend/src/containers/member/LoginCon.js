import LoginCom from "../../components/member/LoginCom";
import {useReducer} from "react";
import {initialState, memberReducer} from "../../modules/memberReducer";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {loginMember} from "../../service/memberService";
import {useAuth} from "../../utils/AuthContext";

function LoginCon() {

    const [state, dispatch] = useReducer(memberReducer, initialState);
    const { username, password, message } = state;
    const navigate = useNavigate();
    const { login } = useAuth();


    const mutation = useMutation({
        mutationFn: loginMember,
        onSuccess: (data) => {

            console.log('LoginCon: Backend login response data:', data);

            alert('✅ 로그인 성공!');

            const receivedAccessToken = data.accessToken || '';
            const receivedMemberId = data.memberId || '';
            const receivedMemberUsername = data.memberUsername || '';
            const receivedMemberRole = data.memberRole || '';
            const receivedMemberNickname = data.memberNickname || '';


            // 로컬 스토리지에 토큰 및 사용자 정보 저장 (AuthContext에서 처리)
            // AuthContext의 login 함수를 호출하여 전역 상태 및 로컬 스토리지 업데이트
            login(receivedAccessToken, receivedMemberId, receivedMemberUsername, receivedMemberRole, receivedMemberNickname);

            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: '' });
            navigate('/');
        },
        onError: (error) => {
            console.error('LoginCon: Login failed error:', error);
            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: '❌ 로그인 실패: ' + error.message });
        }
    });


    const handleSubmit = (e) => {
        e.preventDefault();

        const loginData = {
            memberUsername: username,
            memberPassword: password,
        };
        mutation.mutate(loginData);
    };


    const handleChange = (field, value) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };



    return (
        <>
            <LoginCom
                state={state}
                isLoading={mutation.isLoading}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </>
    )
}

export default LoginCon