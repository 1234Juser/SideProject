import styled from 'styled-components';

export const MyInfoWrapper = styled.div`
    /* 여기에 .myInfo-wrapper 에 주려고 했던 CSS 속성들을 넣습니다 */
    padding: 20px;
    /* max-width: 800px; */
    /* margin: 0 auto; */
    /* background-color: #f9f9f9; */
    /* border-radius: 8px; */
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); */
    border: 1px solid #ff0000;
`;


export const InfoSection = styled.div`
    background-color: #ffffff;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    border: 1px solid olivedrab;
`;

export const InfoItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    &:last-child {
        border-bottom: none;
    }
    border: 1px solid black;
`;

export const InfoLabel = styled.span`
    font-weight: bold;
    color: #555;
    flex-basis: 30%;
    border: 1px solid blueviolet;
`;

export const InfoValue = styled.span`
    color: #333;
    flex-basis: 65%;
    text-align: right;
    border: 1px solid blueviolet;
`;

export const EditButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease-in-out;
    margin-top: 20px;
    width: 100%;

    &:hover {
        background-color: #0056b3;
    }
`;