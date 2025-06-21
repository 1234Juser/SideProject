import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import MyInfoEditCom from "../../components/member/MyInfoEditCom";
import {useAuth} from "../../utils/AuthContext";
import {initialState, memberReducer} from "../../modules/memberReducer";
import {checkNicknameDuplication, fetchMemberInfo, updateMemberInfo} from "../../service/memberService";
import {useNavigate} from "react-router-dom";

function MyInfoEditCon() {
    const {auth, login} = useAuth();
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
        nicknameDuplicateError,
        isNicknameAvailable,
    } = state;

    const navigate = useNavigate()


    useEffect(() => {
        console.log("⚡️ useEffect - isNicknameAvailavle 상태 변경됨 : ", isNicknameAvailable);
        console.log("⚡️ useEffect - nicknameDuplicateError 상태 변경됨", nicknameDuplicateError);
    },[isNicknameAvailable, nicknameDuplicateError])


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
        console.log('----------handleChagne 작동....value', value);

        // 닉네임 필드 변경 시 중복 검사 초기화 및 디바운스 설정
        if (name === 'memberNickname') {
            dispatch({ type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: null });

            // 이전에 설정된 타이머가 있다면 클리어
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            // 0.5초 후에 중복 검사 실행 (사용자 입력이 멈춘 후)
            debounceTimer.current = setTimeout(() => {
                console.log('-----중복 검사 실행-----', debounceTimer.current);
                handleNicknameDuplicationCheck(value);
            }, 500);
        }
    };


    // 닉네임 중복 검사를 위한 함수
    const handleNicknameDuplicationCheck = async (nickname) => {
        console.log("닉네임:", nickname);
        console.log("1-----isNicknameAvailable (디스패치 전):", state.isNicknameAvailable);

        if (!nickname || nickname.trim().length < 2) {
            dispatch({type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: "닉네임은 2자 이상이어야 합니다."});
            dispatch({type: 'SET_NICKNAME_AVAILABLE', payload: false});   // 유효하지 않으니 false
            return;
        }

        try {
            // 현재 로그인된 사용자의 닉네임은 중복 검사 대상에서 제외 ( 즉, 내 닉네임을 변경하지 않고 그대로 유지할 때는 중복 X)
            const initialMemberData = await fetchMemberInfo(auth.accessToken);
            if (initialMemberData && initialMemberData.memberNickname === nickname) {
                dispatch({type: 'SET_NICKNAME_AVAILABLE', payload: true});    // 내 닉네임이므로 사용 가능
                dispatch({type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: null});
                return;
            }

            const isDuplicated = await checkNicknameDuplication(nickname);
            console.log("-------isDuplicated (중복?) :", isDuplicated);
            console.log("2-----isNicknameAvailable (디스패치 전):", state.isNicknameAvailable);

            if (isDuplicated) {
                console.log("🔥 닉네임 중복됨! 오류 메시지 디스패치!"); // 디버깅용 로그
                dispatch({type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: "이미 사용 중인 닉네임입니다."});
                dispatch({type: 'SET_NICKNAME_AVAILABLE', payload: false});

            } else {
                console.log("✅ 닉네임 사용 가능! 상태 디스패치!"); // 디버깅용 로그
                dispatch({type: 'SET_NICKNAME_AVAILABLE', payload: true});
                console.log("3-----isNicknameAvailable (디스패치 후):", state.isNicknameAvailable);
                dispatch({type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: null});

                // 상태가 업데이트된 후 다음 렌더링 주기에 확인
                setTimeout(() => {
                    console.log("⚡️SET_NICKNAME_AVAILABLE 디스패치 후 실제 state.isNicknameAvailable 값 (setTimeout):", state.isNicknameAvailable);
                }, 0); // 0ms 지연으로 다음 이벤트 루프 틱에서 실행
            }
        } catch (err) {
            console.error("닉네임 중복 검사 중 오류:", err);
            console.log("❌ 닉네임 검사 중 예외 발생!"); // 디버깅용 로그
            dispatch({type: 'SET_NICKNAME_DUPLICATION_ERROR', payload: err.message || "닉네임 검사 중 오류가 발생했습니다."});
            dispatch({type: 'SET_NICKNAME_AVAILABLE', payload: false});
        }

        console.log('-----중복 검사 종료-----', debounceTimer.current);
        console.log("4-----isNicknameAvailable (디스패치 후):", state.isNicknameAvailable);

        // }, [auth.accessToken]); // auth.accessToken이 변경될 때 함수 재생성
    }

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

            // 회원 정보 수정 API 호출
            const updatedMemberData = await updateMemberInfo(auth.accessToken, updatePayload);
            const newNickname = updatedMemberData.memberNickname;

            dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: "회원 정보가 성공적으로 수정되었습니다." });

            // 새 비밀번호가 입력된 경우에만 비밀번호 필드 초기화
            if (newPassword) {
                dispatch({ type: 'RESET_PASSWORD_FIELDS' });
            }

            // AuthContext의 login 함수를 호출하여 닉네임 업데이트 (AuthContext에 저장된 다른 정보는 그대로 유지)
            login(
                auth.accessToken,
                auth.memberId,
                auth.memberUsername,
                auth.memberRole,
                newNickname
            );

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
        nicknameDuplicateError,
        isNicknameAvailable,
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


    console.log("MyInfoEditCom으로 전달되는 Props:", MyInfoEditComProps); // 여기에 추가

    // 이외의 경우에는 MyInfoEditCom을 렌더링합니다.
    // MyInfoEditCom의 props에 기본값을 설정했으므로, 여기서는 추가 방어 로직이 필요 없습니다.
    return (
        <MyInfoEditCom {...MyInfoEditComProps} />
    )
}

export default MyInfoEditCon;