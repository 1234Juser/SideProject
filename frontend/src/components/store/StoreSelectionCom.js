import {
    StoreAddress,
    StoreCard, StoreInfo,
    StoreList, StoreName,
    StorePageContainer, StoreSelectButton,
    StoreTitle
} from "../../style/store/StyleStoreSelection";
import KakaoMapCom from "./KakaoMapCom";
import StoreInfoCom from "./StoreInfoCom";
import StoreListCom from "./StoreListCom";

function StoreSelectionCom({storeList, selectedStore, handleStoreSelect, handleConfirmSelection, userLocation, handleStoreClose}) {

    // storeList가 없을 경우 (예: 로딩 중이거나 에러 발생 시)를 대비하여 안전하게 렌더링
    if (!storeList) {
        return null; // 또는 로딩 스피너 등을 반환할 수 있습니다.
    }

    console.log('여기서 선택한 매장 확인하기...', selectedStore);

    return (
        <>
            <StoreTitle>주문하실 곳을 선택하세요!</StoreTitle>
            <StorePageContainer>
                <KakaoMapCom userLocation={userLocation} storeList={storeList} handleStoreSelect={handleStoreSelect} selectedStore={selectedStore}/>
                <StoreInfoCom selectedStore={selectedStore} handleStoreClose={handleStoreClose}/>
                <StoreSelectButton onClick={handleConfirmSelection} disabled={!selectedStore}>
                    { selectedStore ? `${selectedStore.storeName} 으로 주문하기` : `매장을 선택하세요` }
                </StoreSelectButton>
            </StorePageContainer>
        </>
    )
}

export default StoreSelectionCom