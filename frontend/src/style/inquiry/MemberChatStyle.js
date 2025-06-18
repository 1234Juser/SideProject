import styled from 'styled-components';

export const ChatContainer = styled.div`
    padding: 30px;
    max-width: 900px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Title = styled.h2`
    text-align: center;
    color: #333d4b;
    margin-bottom: 30px;
    font-size: 2em;
    font-weight: 600;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 15px;
`;

export const SessionList = styled.ul`
    list-style: none;
    padding: 0;
    display: grid;
    gap: 15px; /* 항목 간 간격 */
`;

export const SessionItem = styled.li`
    background-color: #fcfcfc;
    border: 1px solid #e9ecef;
    border-radius: 10px;
    padding: 20px 25px;
    display: flex;
    flex-direction: column; /* 세로 정렬 */
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    position: relative; /* 상태 뱃지 위치 지정을 위해 */

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-color: #007bff; /* 호버 시 테두리 색상 변경 */
    }
`;

export const SessionInfo = styled.div`
    flex-grow: 1;
    margin-bottom: 10px; /* 정보와 날짜 사이 간격 */
`;

export const SessionId = styled.p`
    font-weight: bold;
    color: #4a5568;
    font-size: 1.1em;
    margin-bottom: 5px;
`;

export const SessionDate = styled.p`
    font-size: 0.9em;
    color: #718096;
    display: block; /* 날짜도 블록으로 */
`;

export const SessionStatus = styled.span`
    position: absolute; /* 절대 위치로 뱃지 배치 */
    top: 15px;
    right: 15px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8em;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.5px;
    background-color: ${props => {
        switch (props.$status) {
            case 'OPEN':
                return '#28a745'; /* Green */
            case 'CLOSED':
                return '#6c757d'; /* Gray */
            case 'ARCHIVED':
                return '#ffc107'; /* Yellow */
            default:
                return '#007bff'; /* Blue for others or unknown */
        }
    }};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const EmptyMessage = styled.p`
    text-align: center;
    color: #718096;
    font-size: 1.1em;
    padding: 30px;
    background-color: #f4f6f8;
    border-radius: 8px;
    border: 1px dashed #ced4da;
`;

export const ErrorMessage = styled.p`
    color: #dc3545;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
    padding: 20px;
    background-color: #ffe0e6;
    border-radius: 8px;
    border: 1px solid #ffafbb;
`;

export const LoadingMessage = styled.p`
    text-align: center;
    color: #007bff;
    font-size: 1.2em;
    padding: 20px;
    background-color: #e6f7ff;
    border-radius: 8px;
    border: 1px solid #91d5ff;
`;