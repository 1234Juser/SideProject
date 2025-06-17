import React, {useEffect, useReducer, useState} from 'react';
import MyInfoEditCom from "../../components/member/MyInfoEditCom";
import {useAuth} from "../../utils/AuthContext";
import {initialState, memberReducer} from "../../modules/memberReducer";
import {fetchMemberInfo, updateMemberInfo} from "../../service/memberService";

function MyInfoEditCon() {
    const {auth} = useAuth();
    const [state, dispatch] = useReducer(memberReducer, initialState);

    const {
        memberNickname,
        memberPhoneNumber,
        currentPassword,
        newPassword,
        confirmNewPassword,
        loading,
        error,
        successMessage,
        formErrors,
    } = state;


    // 컴포넌트 마운트 시 현재 사용자 정보 불러와서 폼 초기화
    useEffect(() => {
        const loadInitialData = async () => {
            if (!auth.isAuthenticated || !auth.accessToken) {
                dispatch({ type : 'SET_ERROR', payload: "로그인이 필요합니다. "});
                dispatch({ type: 'SET_LOADING', payload: false});
                return
            }

            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            try {
                const memberData = await fetchMemberInfo(auth.accessToken);
                dispatch({type: 'SET_INITIAL_DATA', payload: memberData})
            } catch (err) {
                console.error("멤버 정보를 불러오는데 실패했습니다.", err);
                dispatch({ type: 'SET_ERROR', payload: err.message || "현재 정보를 불러오는데 실패했습니다." });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }

        loadInitialData();
    }, [auth.isAuthenticated, auth.accessToken]);   // auth.accessToken 변경 시 재실행


    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({type: 'SET_FIELD', field: name,  value});
    };


    // 각 필드의 유효성 검사
    const validateForm = () => {
        const errors = {};

        // 닉네임 유효성
        if (!memberNickname || memberNickname.trim().length < 2) {
            errors.memberNickname = "닉네임은 2자 이상이어야 합니다.";
        }

        // 전화번호 유효성
        if (!memberPhoneNumber || !/^\d{2,3}-\d{3,4}-\d{4}$/.test(memberPhoneNumber)) {
            errors.memberPhoneNumber = "유효한 전화번호 형식이 아닙니다 (예: 010-1234-5678).";
        }

        // 비밀번호 관련 필드 유효성
        if (!currentPassword) {
            errors.currentPassword = "현재 비밀번호를 입력해주세요.";
        }
        if (!newPassword || newPassword.length < 8) {
            errors.newPassword = "새 비밀번호는 8자 이상이어야 합니다.";
        }
        if (newPassword !== confirmNewPassword) {
            errors.confirmNewPassword = "새 비밀번호가 일치하지 않습니다.";
        }

        dispatch({ type: 'SET_FORM_ERRORS', payload: errors });
        return Object.keys(errors).length === 0;
    };


    // 정보 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null }); // 이전 성공 메시지 초기화

/*
        // 비밀번호 필드가 비어있으면 유효성 검사에서 제외
        let formIsValid = true;
        if (currentPassword || newPassword || confirmNewPassword) {
            formIsValid = validateForm();
        } else {
            // 비밀번호 필드가 비어있다면, 닉네임/전화번호만 유효성 검사
            const errors = {};
            if (!memberNickname || memberNickname.trim().length < 2) {
                errors.memberNickname = "닉네임은 2자 이상이어야 합니다.";
            }
            if (!memberPhoneNumber || !/^\d{2,3}-\d{3,4}-\d{4}$/.test(memberPhoneNumber)) {
                errors.memberPhoneNumber = "유효한 전화번호 형식이 아닙니다 (예: 010-1234-5678).";
            }
            dispatch({ type: 'SET_FORM_ERRORS', payload: errors });
            formIsValid = Object.keys(errors).length === 0;
        }
        */

        if (!validateForm()) {
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const updatePayload = {
                memberNickname: memberNickname,
                memberPhoneNumber: memberPhoneNumber,
/*                currentPassword: currentPassword, // 비밀번호 필드 항상 포함
                newPassword: newPassword,         // 비밀번호 필드 항상 포함*/
                // 비밀번호 필드는 값이 있을 때만 포함
                ...(currentPassword && { currentPassword: currentPassword }),
                ...(newPassword && { newPassword: newPassword }),

            };

            const message = await updateMemberInfo(auth.accessToken, updatePayload);
            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message || "회원 정보가 성공적으로 수정되었습니다." });

            // 비밀번호 변경 성공 시 비밀번호 필드 초기화
            if (newPassword) { // 새 비밀번호가 입력된 경우에만 초기화
                dispatch({ type: 'RESET_PASSWORD_FIELDS' });
            }

        } catch (err) {
            console.error("Failed to update member info:", err);
            dispatch({ type: 'SET_ERROR', payload: err.message || "정보 수정에 실패했습니다." });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };



    // MyInfoEditCom 컴포넌트에 필요한 모든 상태와 핸들러를 props로 전달
    const MyInfoEditComProps = {
        // 폼 데이터를 객체로 묶어 전달
        formData: {
            memberNickname,
            memberPhoneNumber,
            currentPassword,
            newPassword,
            confirmNewPassword,
        },
        loading,
        error,
        successMessage,
        formErrors,
        handleChange,
        handleSubmit,
    };


    // 렌더링 조건은 하나로 통합합니다.
    // loading이 true이고 memberNickname이 아직 초기값이라면 로딩 메시지 표시
    // 이 조건이 false가 되면 MyInfoEditCom을 렌더링합니다.
    if (loading && memberNickname === '') {
        return (
            <div>
                <p>현재 정보를 불러오는 중...</p>
            </div>
        );
    }

    // 이외의 경우에는 MyInfoEditCom을 렌더링합니다.
    // MyInfoEditCom의 props에 기본값을 설정했으므로, 여기서는 추가 방어 로직이 필요 없습니다.
    return (
        <MyInfoEditCom {...MyInfoEditComProps} />
    )
}

export default MyInfoEditCon;