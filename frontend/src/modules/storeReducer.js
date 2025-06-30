export const initialState = {
    selectedStore : null,

}

export const storeSelectionReducer = (state, action) => {
    switch (action.type) {
        case 'SELECT_STORE' :
            return {...state, selectedStore : action.payload};
        case 'CONFIRM_SELECTION' :
            // 이 액션은 실제 상태 변경보다는 부모 컴포넌트에서 비즈니스 로직을 트리거하는 용도로 사용될 수 있습니다.
            // 여기서는 selectedStore를 반환하지만, 실제 로직은 handleConfirmSelection에서 처리됩니다.
            return state;
        default:
            return state;
    }
}