import {
    StoreAddress,
    StoreCard, StoreInfo,
    StoreList, StoreName,
    StorePageContainer, StoreSelectButton,
    StoreTitle
} from "../../style/store/StyleStoreSelection";

function StoreSelectionCom({storeList, selectedStore, handleStoreSelect, handleConfirmSelection}) {

    // storeList가 없을 경우 (예: 로딩 중이거나 에러 발생 시)를 대비하여 안전하게 렌더링
    if (!storeList) {
        return null; // 또는 로딩 스피너 등을 반환할 수 있습니다.
    }


    return (
        <StorePageContainer>
            <StoreTitle>매장을 선택해주세요</StoreTitle>
            <StoreList>
                {storeList.map(store => (
                    <StoreCard
                        key={store.storeId}
                        onClick={() => handleStoreSelect(store)}
                        isSelected={selectedStore && selectedStore.id === store.storeId}     // selectedStore가 null이 아닌 경우에만 비교
                    >
                        <StoreName>{store.storeName}</StoreName>
                        <StoreAddress>{store.storeAddress}</StoreAddress>
                        {/*{store.operatingHours && <StoreInfo>영업 시간: {store.operatingHours}</StoreInfo>}*/}
                        {store.storeTel && <StoreInfo>전화번호: {store.storeTel}</StoreInfo>}
                    </StoreCard>
                ))}
            </StoreList>
            <StoreSelectButton onClick={handleConfirmSelection} disabled={!selectedStore}>
                선택 완료
            </StoreSelectButton>
        </StorePageContainer>
    )
}

export default StoreSelectionCom