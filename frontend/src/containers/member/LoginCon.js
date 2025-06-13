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

            // 백엔드에서 받은 데이터가 undefined/null인 경우를 대비하여 빈 문자열로 대체하여 전달합니다.
            // 이렇게 하면 localStorage에 "undefined" 문자열이 저장되는 것을 방지합니다.
            const receivedAccessToken = data.accessToken || '';
            const receivedMemberUsername = data.memberUsername || '';
            const receivedMemberRole = data.memberRole || '';
            const receivedMemberNickname = data.memberNickname || '';


            // 로컬 스토리지에 토큰 및 사용자 정보 저장 (AuthContext에서 처리)
            // AuthContext의 login 함수를 호출하여 전역 상태 및 로컬 스토리지 업데이트
            login(receivedAccessToken, receivedMemberUsername, receivedMemberRole, receivedMemberNickname);

            dispatch({ type: 'SET_MESSAGE', payload: '' });
            navigate('/');
        },
        onError: (error) => {
            console.error('LoginCon: Login failed error:', error);
            dispatch({ type: 'SET_MESSAGE', payload: '❌ 로그인 실패: ' + error.message });
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