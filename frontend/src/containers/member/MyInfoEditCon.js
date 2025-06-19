import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import MyInfoEditCom from "../../components/member/MyInfoEditCom";
import {useAuth} from "../../utils/AuthContext";
import {initialState, memberReducer} from "../../modules/memberReducer";
import {checkNicknameDuplication, fetchMemberInfo, updateMemberInfo} from "../../service/memberService";
import {useNavigate} from "react-router-dom";

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
        nicknameDuplicateError, // 추가된 상태
        isNicknameAvailable,    // 추가된 상태
    } = state;

    const navigate = useNavigate()



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



    // 디바운싱을 위한 타이머 useRef
    const debounceTimer = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({type: 'SET_FIELD', field: name,  value});

        // 닉네임 필드 변경 시 중복 검사 초기화 및 디바운스 설정
        if (name === 'memberNickname') {
            dispatch({ type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: null }); // 오류 초기화
            dispatch({ type: 'SET_NICKNAME_AVAILABLE', payload: null }); // 가능 여부 초기화

            // 이전에 설정된 타이머가 있다면 클리어
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            // 0.5초 후에 중복 검사 실행 (사용자 입력이 멈춘 후)
            debounceTimer.current = setTimeout(() => {
                handleNicknameDuplicationCheck(value);
            }, 500);
        }
    };


    // 닉네임 중복 검사를 위한 함수
    const handleNicknameDuplicationCheck = useCallback(async (nickname) => {
        if (!nickname || nickname.trim().length < 2) {
            dispatch({ type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: "닉네임은 2자 이상이어야 합니다." });
            dispatch({ type: 'SET_NICKNAME_AVAILABLE', payload: false }); // 유효하지 않으니 false
            return;
        }

        try {
            // 현재 로그인된 사용자의 닉네임은 중복 검사 대상에서 제외 (선택 사항)
            // 즉, 내 닉네임을 내가 변경하지 않고 그대로 유지할 때는 중복이 아니어야 함.
            const initialMemberData = await fetchMemberInfo(auth.accessToken); // 현재 사용자 정보 가져옴
            if (initialMemberData && initialMemberData.memberNickname === nickname) {
                dispatch({ type: 'SET_NICKNAME_AVAILABLE', payload: true }); // 내 닉네임이므로 사용 가능
                dispatch({ type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: null });
                return;
            }


            const isDuplicated = await checkNicknameDuplication(nickname);
            if (isDuplicated) {
                dispatch({ type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: "이미 사용 중인 닉네임입니다." });
                dispatch({ type: 'SET_NICKNAME_AVAILABLE', payload: false });
            } else {
                dispatch({ type: 'SET_NICKNAME_AVAILABLE', payload: true });
                dispatch({ type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: null });
            }
        } catch (err) {
            console.error("닉네임 중복 검사 중 오류:", err);
            dispatch({ type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: err.message || "닉네임 검사 중 오류가 발생했습니다." });
            dispatch({ type: 'SET_NICKNAME_AVAILABLE', payload: false });
        }
    }, [auth.accessToken]); // auth.accessToken이 변경될 때 함수 재생성


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

        // 비밀번호 관련 필드 중 하나라도 값이 입력된 경우에만 비밀번호 유효성 검사 수행
        if (currentPassword || newPassword || confirmNewPassword) {
            if (!currentPassword) {
                errors.currentPassword = "현재 비밀번호를 입력해주세요.";
            }
            if (!newPassword || newPassword.length < 8) {
                errors.newPassword = "새 비밀번호는 8자 이상이어야 합니다.";
            }
            if (newPassword !== confirmNewPassword) {
                errors.confirmNewPassword = "새 비밀번호가 일치하지 않습니다.";
            }
        }

        dispatch({ type: 'SET_FORM_ERRORS', payload: errors });
        return Object.keys(errors).length === 0;
    };


    // 정보 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null }); // 이전 성공 메시지 초기화

        // 유효성 검사
        if (!validateForm()) {
            return;
        }


        // 닉네임이 변경되었고, 아직 검사 중이거나 중복된 상태라면 제출 방지
        // 또는 닉네임이 변경되었으나 사용 가능하지 않은 상태라면 제출 방지
        if (memberNickname && isNicknameAvailable === false) { // 닉네임이 변경됐고, 사용 불가라면
            dispatch({ type: 'SET_ERROR', payload: nicknameDuplicateError || "닉네임 중복 검사를 완료하거나 다른 닉네임을 사용해주세요." });
            return;
        }
        // 닉네임이 변경됐는데 아직 검사가 안된 상태일 수도 있으니
        // debounceTimer가 아직 동작 중이라면 제출을 막거나, 검사 완료를 기다리게 할 수도 있습니다.
        // 여기서는 그냥 isNicknameAvailable === false 일 때만 막는 것으로 간소화합니다.


        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const updatePayload = {
                memberNickname: memberNickname,
                memberPhoneNumber: memberPhoneNumber,
                // 비밀번호 필드는 값이 있을 때만 포함
                ...(currentPassword && { currentPassword: currentPassword }),
                ...(newPassword && { newPassword: newPassword }),

            };

            const message = await updateMemberInfo(auth.accessToken, updatePayload);
            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message || "회원 정보가 성공적으로 수정되었습니다." });

            // 비밀번호 변경 성공 시 비밀번호 필드 초기화
            if (newPassword) {       // 새 비밀번호가 입력된 경우에만 초기화
                dispatch({ type: 'RESET_PASSWORD_FIELDS' });
            }

            alert("정보가 수정되었습니다.")
            navigate('/mypage/my-info');

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
        nicknameDuplicateError, // 추가된 prop
        isNicknameAvailable,    // 추가된 prop
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