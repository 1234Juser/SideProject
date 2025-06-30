import StoreSelectionCom from "../../components/store/StoreSelectionCom";
import {useLocation, useNavigate} from "react-router-dom";
import {useReducer, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getAllStores} from "../../service/storeService";
import {StorePageContainer} from "../../style/store/StyleStoreSelection";
import {initialState, storeSelectionReducer} from "../../modules/storeReducer";

function StoreSelectionCon() {

    const location = useLocation();
    const navigate = useNavigate();
    const {orderOptions} = location.state || {};

    const [state, dispatch] = useReducer(storeSelectionReducer, initialState)
    const {selectedStore} = state;

    const { data : storeList, isLoading, isError,error, } = useQuery({
        queryKey : ['storeList'],
        queryFn : () => getAllStores(),
        staleTime : 1000 * 60 * 5,
    })


    // 매장 선택
    const handleStoreSelect = (store) => {
        dispatch({type : 'SELECT_STORE', payload : store})
    };


    // 선택 완료
    const handleConfirmSelection = () => {
        if (selectedStore && orderOptions) {
            // 선택된 매장 정보와 기존 주문 옵션을 합쳐서 다음 단계로 전달하거나 처리합니다.
            const finalOrder = {
                ...orderOptions,
                store: selectedStore
            };
            console.log("최종 주문 정보:", finalOrder);
            // 예: 주문 확정 페이지로 이동하거나 백엔드로 주문 전송
            navigate('/order-confirmation', { state: { finalOrder } });
        } else {
            alert("매장을 선택해주세요.");
        }
    };

    if (isLoading) return <StorePageContainer><p>매장 정보를 불러오는 중...</p></StorePageContainer>;
    if (error) return <StorePageContainer><p>매장 정보를 불러오는데 실패했습니다: {error.message}</p></StorePageContainer>;
    if (!orderOptions) return <StorePageContainer><p>주문 정보가 없습니다. 메뉴 페이지로 돌아가세요.</p></StorePageContainer>; // 잘못된 접근 방지



    return (
        <>
            <StoreSelectionCom storeList={storeList}
                                                selectedStore={selectedStore}
                                                handleStoreSelect={handleStoreSelect}
                                                handleConfirmSelection={handleConfirmSelection}
            />
        </>
    )
}

export default StoreSelectionCon