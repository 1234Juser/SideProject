import React, {useEffect, useState} from 'react';
import {SectionTitle} from "../../style/member/StyleMyPage";
import {EditButton, InfoItem, InfoLabel, InfoSection, InfoValue, MyInfoWrapper} from "../../style/member/StyleMyInfo";
import {useNavigate} from "react-router-dom";

function MyInfoCom({memberInfo}) {

    const navigate = useNavigate();


    return (
        <MyInfoWrapper>
                <SectionTitle>내 정보</SectionTitle>
                <InfoSection>
                    <InfoItem>
                        <InfoLabel>아이디</InfoLabel>
                        <InfoValue>{memberInfo.memberUsername}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>이메일</InfoLabel>
                        <InfoValue>{memberInfo.memberEmail}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>닉네임</InfoLabel>
                        <InfoValue>{memberInfo.memberNickname}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>전화번호</InfoLabel>
                        <InfoValue>{memberInfo.memberPhoneNumber}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>회원 등급</InfoLabel>
                        <InfoValue>{memberInfo.memberRole === 'ROLE_USER' ? '일반 회원' : memberInfo.memberRole}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>가입일</InfoLabel>
                        <InfoValue>{new Date(memberInfo.memberCreatedAt).toLocaleDateString()}</InfoValue>
                    </InfoItem>
                    {/* 비밀번호는 직접 노출하지 않고, 변경 버튼만 제공하는 것이 일반적입니다. */}
                    <EditButton onClick={() => navigate("/mypage/my-info-edit")}>
                        내 정보 수정
                    </EditButton>
                </InfoSection>
        </MyInfoWrapper>
    );
}

export default MyInfoCom;