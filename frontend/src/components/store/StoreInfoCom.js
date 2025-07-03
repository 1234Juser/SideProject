import React, {useState} from "react";
import {
    CloseButton,
    ContentWrapper,
    InfoContainer,
    LinkButton, StoreAddress,
    StoreImage, StoreText,
    StoreTitle
} from "../../style/store/StyleStoreInfo";

const StoreInfo = ({ selectedStore , handleStoreClose }) => {

    if (!selectedStore) {
        return (
            <InfoContainer>
                <p style={{textAlign:"center"}}>지도에서 매장을 선택해주세요.</p>
            </InfoContainer>
        )
    };

    return (
        <InfoContainer>
            <CloseButton onClick={handleStoreClose}>&times;</CloseButton>
            <ContentWrapper>
                <StoreTitle>{selectedStore.storeName}</StoreTitle>
                <StoreAddress>{selectedStore.storeAddress}</StoreAddress>
                <StoreText>{selectedStore.storeStatus} </StoreText>
                <StoreText>영업 시간 : 07:00~21:00</StoreText>
                <StoreText>{selectedStore.storeTel}</StoreText>
            </ContentWrapper>
        </InfoContainer>
    );
};

export default StoreInfo;