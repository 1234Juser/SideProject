export const initialState = {
    username : '',
    password : '',
    email: '',
    nickname: '',
    phoneNumber: '',
    message: '',
}

export function memberReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'SET_MESSAGE':
            return {
                ...state,
                message: action.payload,
            };
        case 'RESET_FORM':
            return {
                ...initialState, // 폼 초기화
                message: state.message, // 메시지는 유지 (선택 사항)
            };
        default:
            return state;
    }
}