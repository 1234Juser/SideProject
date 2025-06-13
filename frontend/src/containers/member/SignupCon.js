import SignupCom from "../../components/member/SignupCom";
import {useReducer} from "react";
import {useMutation} from "@tanstack/react-query";
import {signupMember} from "../../service/memberService";
import {initialState, memberReducer} from "../../modules/memberReducer";
import {useNavigate} from "react-router-dom";

function SignupCon() {
    const [state, dispatch] = useReducer(memberReducer, initialState);
    const { username, password, email, nickname, phoneNumber, message } = state;

    const navigate = useNavigate();



    // useMutation 훅을 사용하여 회원가입 요청 처리
    const mutation = useMutation({
        mutationFn: signupMember,
        onSuccess: (data) => {
            alert('회원가입이 완료되었습니다!');

            dispatch({type : 'SET_MESSAGE', payload : data});
            dispatch({type : 'RESET_FORM'});

            navigate('/');
        },
        onError: (error) => {
            dispatch({type : 'SET_MESSAGE', payload : error.toString()});
        }
    });




    const handleSubmit = async (e) => {
        e.preventDefault();

        // DTO에 맞게 데이터 객체 생성
        const memberData = {
            memberUsername: username,
            memberPassword: password,
            memberEmail: email,
            memberNickname: nickname,
            memberPhoneNumber: phoneNumber,
        };
        mutation.mutate(memberData); // mutation 실행

    };


    const handleChange = (field, value) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };


    return (
        <>
            <SignupCom state={state} isLoading={mutation.isLoading} handleSubmit={handleSubmit}
                                        handleChange={handleChange}
            />
        </>

    )
}

export  default  SignupCon