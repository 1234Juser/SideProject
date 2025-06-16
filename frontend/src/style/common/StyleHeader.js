import styled from 'styled-components';
import {Link} from "react-router-dom";

export const HeaderWrapper = styled.header`
    display: flex;
    flex-direction: column;
    //width: 100%;
    padding: 16px;
    border-bottom: 1px solid #ddd;
    background-color: #fff;

    @media (min-width: 768px) {
        //padding: 24px 40px;
    }
`;


// 상단 행 전체
export const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid black;
`;


// 버튼 묶음 (예: 로그인, 로그아웃)
export const TopButtons = styled.div`
    display: flex;
    gap: 12px;
`;


// 왼쪽: 로고
export const Logo = styled.h1`
    font-family: 'Cafe24ClassicType', sans-serif;
    font-size: 20px;
    border: 1px solid black;

    @media (min-width: 768px) {
        font-size: 24px;
    }
`;

export const UserInfoContainer = styled.div`
    display: flex;
    flex-direction: column; /* 모바일에서 세로로 배치 */
    align-items: flex-end; /* 오른쪽 정렬 */
    gap: 8px; /* 요소들 간 간격 */
    margin-right: 10px; /* 닉네임과 버튼 사이 간격 */
    border: 1px solid black;

    @media (min-width: 768px) {
        flex-direction: row; /* 데스크톱에서 가로로 배치 */
        align-items: center; /* 세로 가운데 정렬 */
        gap: 15px; /* 요소들 간 간격 */
        margin-right: 0; /* 데스크톱에서는 외부 마진 제거 */
    }
`;

// 닉네임
export const NicknameSpan = styled.span`
    font-size: 14px;
    white-space: nowrap;

    @media (min-width: 768px) {
        font-size: 16px;
    }
`;

// 각 버튼
export const StyledLink = styled(Link)`
    font-size: 14px;
    text-decoration: underline;
    color: inherit;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    &:hover {
        color: #007bff;
    }

    @media (min-width: 768px) {
        font-size: 16px;
    }
`;
