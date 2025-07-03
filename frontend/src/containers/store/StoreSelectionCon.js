import StoreSelectionCom from "../../components/store/StoreSelectionCom";
import {useLocation, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useReducer, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getAllStores} from "../../service/storeService";
import {StorePageContainer} from "../../style/store/StyleStoreSelection";
import {initialState, storeSelectionReducer} from "../../modules/storeReducer";

function StoreSelectionCon() {

    const location = useLocation();
    const navigate = useNavigate();
    const {orderOptions} = location.state || {};

    const [state, dispatch] = useReducer(storeSelectionReducer, initialState)
    const {selectedStore, userLocation, error : reducerError} = state;      // useQuery의 error와 구분


    // 1. 사용자의 현재 위치 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    dispatch({ type : 'SET_USER_LOCATION', payload : { latitude, longitude }});
                    console.log("사용자 현재 위치:", latitude, longitude);
                },
                error => {
                    console.error("위치 정보를 가져오는데 실패했습니다. : ", error);
                    dispatch({ type : 'SET_ERROR', payload : "위치 정보를 가져올 수 없습니다. 브라우저 설정에서 위치 접근을 허용해주세요." });
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            dispatch({ type : 'SET_ERROR', payload : "이 브라우저는 위치 정보를 지원하지 않습니다."});
        }
    }, []);


    // 2. userLocation이 있을 때만 매장 전체 목록 가져오기
    const { data : storeList, isLoading, isError,error : queryError, } = useQuery({
        queryKey : ['storeList', userLocation],     // userLocation이 변경되면 쿼리 다시 실행
        queryFn : () => getAllStores(userLocation.latitude, userLocation.longitude),
        enabled : !!userLocation,           // userLocation이 유효할 때만 쿼리 실행
        staleTime : 1000 * 60 * 5,
    })


    // 매장 선택 (useCallback으로 감싸 함수 참조 안정화)
    const handleStoreSelect = useCallback((store) => {
        dispatch({type : 'SELECT_STORE', payload : store})
        console.log('선택한 매장 확인 : ', store);
    }, [dispatch]);         // dispatch는 useReducer가 반환하는 함수로, 리렌더링되어도 변경되지 않음.


    const handleStoreClose = useCallback(() => {
        dispatch({type : 'CLEAR_SELECTION'})
        console.log('선택 취소');
    }, [dispatch]);     // dispatch는 항상 동일한 참조를 유지하므로 의존성 배열에 추가해도 안전합니다.


    // 선택 완료 (useCallback으로 감싸 함수 참조 안정화)
    const handleConfirmSelection = useCallback(() => {
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
    }, [selectedStore, orderOptions, navigate]);

    if (isLoading) return <StorePageContainer><p>매장 정보를 불러오는 중...</p></StorePageContainer>;
    if (queryError) return <StorePageContainer><p>매장 정보를 불러오는데 실패했습니다: {queryError.message}</p></StorePageContainer>;
    if (!orderOptions) return <StorePageContainer><p>주문 정보가 없습니다. 메뉴 페이지로 돌아가세요.</p></StorePageContainer>; // 잘못된 접근 방지
    if (reducerError) return <StorePageContainer><p>오류: {reducerError}</p></StorePageContainer>; // 위치 정보 에러 처리



    return (
        <>
            <StoreSelectionCom storeList={storeList}
                                                selectedStore={selectedStore}
                                                handleStoreSelect={handleStoreSelect}
                                                handleConfirmSelection={handleConfirmSelection}
                                                userLocation={userLocation}
                                                handleStoreClose={handleStoreClose}
            />
        </>
    )
}

export default StoreSelectionCon