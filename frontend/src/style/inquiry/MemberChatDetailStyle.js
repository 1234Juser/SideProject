import styled from 'styled-components';

export const DetailContainer = styled.div`
    padding: 30px;
    max-width: 900px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const DetailTitle = styled.h2`
    text-align: center;
    color: #333d4b;
    margin-bottom: 30px;
    font-size: 2em;
    font-weight: 600;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 15px;
`;

export const SessionOverview = styled.div`
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
`;

export const SessionInfoText = styled.p`
    margin: 0;
    color: #495057;
    font-size: 1.05em;

    strong {
        color: #212529;
    }
`;

export const SessionDetailStatus = styled.span`
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 700;
    color: #ffffff;
    background-color: ${props => {
        switch (props.$status) {
            case 'OPEN':
                return '#28a745'; /* Green */
            case 'CLOSED':
                return '#6c757d'; /* Gray */
            default:
                return '#007bff'; /* Blue */
        }
    }};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const MessageList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: 500px; /* 스크롤바를 위한 최대 높이 */
    overflow-y: auto; /* 내용이 넘치면 스크롤바 생성 */
    padding-right: 10px; /* 스크롤바와 메시지 내용 사이 간격 */
`;

export const MessageBox = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 80%;
    padding: 12px 18px;
    border-radius: 18px;
    word-break: break-word; /* 긴 단어 강제 줄바꿈 */

    ${props => props.$isUser ? `
        align-self: flex-end;
        background-color: #007bff;
        color: white;
        border-bottom-right-radius: 4px;
    ` : `
        align-self: flex-start;
        background-color: #e2e6ea;
        color: #343a40;
        border-bottom-left-radius: 4px;
    `}
`;

export const MessageSender = styled.span`
    font-size: 0.85em;
    font-weight: bold;
    margin-bottom: 5px;
    ${props => props.$isUser ? `
        color: rgba(255, 255, 255, 0.8);
    ` : `
        color: #5a677a;
    `}
`;

export const MessageText = styled.p`
    margin: 0;
    font-size: 1em;
    line-height: 1.4;
`;

export const MessageTimestamp = styled.span`
    font-size: 0.75em;
    margin-top: 5px;
    ${props => props.$isUser ? `
        color: rgba(255, 255, 255, 0.6);
        text-align: right;
    ` : `
        color: #868e96;
        text-align: left;
    `}
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

export const NoMessages = styled.p`
    text-align: center;
    color: #718096;
    font-style: italic;
    padding: 20px;
    background-color: #f4f6f8;
    border-radius: 8px;
    border: 1px dashed #ced4da;
`;

export const BackButton = styled.button`
    display: block;
    width: fit-content;
    margin: 30px auto 0;
    padding: 10px 25px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #5a6268;
    }
`;