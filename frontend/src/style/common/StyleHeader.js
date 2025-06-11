import styled from 'styled-components';

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