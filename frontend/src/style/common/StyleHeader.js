import styled from 'styled-components';
import {Link} from "react-router-dom";

export const HeaderWrapper = styled.header`
    padding: 16px;
    display: flex;
    flex-direction: column; /* 아래로 배치되도록 변경 */
    gap: 12px;
    border: 1px solid black;

    @media (min-width: 768px) {
        padding: 24px 40px;
    }
`;


export const TopRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


export const TopButtons = styled.div`
    display: flex;
    gap: 12px;
`;


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

    @media (min-width: 768px) {
        flex-direction: row; /* 데스크톱에서 가로로 배치 */
        align-items: center; /* 세로 가운데 정렬 */
        gap: 15px; /* 요소들 간 간격 */
        margin-right: 0; /* 데스크톱에서는 외부 마진 제거 */
    }
`;

export const NicknameSpan = styled.span`
    white-space: nowrap; /* 닉네임이 줄바꿈되지 않도록 */
    font-size: 14px; /* 모바일 글꼴 크기 */

    @media (min-width: 768px) {
        font-size: 16px; /* 데스크톱 글꼴 크기 */
    }
`;

export const StyledLink = styled(Link)`
    background: none;
    border: none;
    color: inherit; /* 부모 요소의 글자 색상 상속 */
    cursor: pointer;
    text-decoration: underline;
    padding: 0; /* Link 기본 패딩 제거 */
    font-size: 14px; /* 모바일 글꼴 크기 */

    &:hover {
        color: #007bff; /* 호버 시 색상 변경 예시 */
    }

    @media (min-width: 768px) {
        font-size: 16px; /* 데스크톱 글꼴 크기 */
    }
`;
