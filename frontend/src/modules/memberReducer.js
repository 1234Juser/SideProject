export const initialState = {
    // 수정폼 데이터 필드
    memberNickname: '',
    memberPhoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',

    // UI 상태 필드
    loading : true,
    error : null,
    successMessage : null,
    formErros: {},
    nicknameDuplicateError: null, // 닉네임 중복 오류 메시지 저장
    isNicknameAvailable: null,   // 닉네임 사용 가능 여부 (true/false/null)
}

export function memberReducer(state, action) {
    switch (action.type) {
        // 특정 폼 필드 값 설정
        case 'SET_FIELD':
            // 폼 에러도 함께 초기화 (사용자가 다시 입력하면 에러는 사라져야 함)
            const newFormErrors = { ...state.formErrors };
            delete newFormErrors[action.field];
            return {
                ...state,
                [action.field]: action.value,
                formErrors: newFormErrors,
            };
        // 로딩 상태 설정
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        // 일반 에러 메시지 설정
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                successMessage: null, // 에러 발생 시 성공 메시지 초기화
            };
        // 성공 메시지 설정
        case 'SET_SUCCESS_MESSAGE':
            return {
                ...state,
                successMessage: action.payload,
                error: null, // 성공 시 에러 메시지 초기화
                loading: false, // 성공했으니 로딩 종료
            };
        // 폼 필드별 에러 설정 (유효성 검사용)
        case 'SET_FORM_ERRORS':
            return {
                ...state,
                formErrors: action.payload,
            };
        // 폼 초기화 (성공 시 또는 초기 로딩 시)
        case 'RESET_FORM':
            return {
                ...initialState, // 모든 폼 관련 상태 초기화
            };
        // 초기 데이터 설정 (API에서 가져온 정보로 폼 필드 초기화)
        case 'SET_INITIAL_DATA':
            return {
                ...state,
                memberNickname: action.payload.memberNickname || '',
                memberPhoneNumber: action.payload.memberPhoneNumber || '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                loading: false,
            };
        // 비밀번호 변경 성공 시 비밀번호 필드만 초기화
        case 'RESET_PASSWORD_FIELDS':
            return {
                ...state,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                formErrors: { // 비밀번호 관련 에러 제거
                    ...state.formErrors,
                    currentPassword: undefined,
                    newPassword: undefined,
                    confirmNewPassword: undefined,
                },
            };
        case 'SET_NICKNAME_DUPLICATION_ERROR':
            return {
                ...state,
                nicknameDuplicateError: action.payload,
                isNicknameAvailable: null
            };
        case 'SET_NICKNAME_AVAILABLE':
            return { ...state,
                isNicknameAvailable: action.payload,
                nicknameDuplicateError: null
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}