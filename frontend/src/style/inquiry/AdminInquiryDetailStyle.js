import styled from 'styled-components';

export const DetailContainer = styled.div`
    padding: 30px;
    background-color: #f0f2f5; /* 밝은 회색 배경 */
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    margin: 30px auto;
    max-width: 900px; /* 최대 너비 설정 */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Title = styled.h2`
    color: #2c3e50; /* 진한 회색 제목 */
    margin-bottom: 30px;
    text-align: center;
    font-size: 2.2em;
    font-weight: 700;
    position: relative;
    padding-bottom: 10px;

    &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 80px;
        height: 4px;
        background-color: #3498db; /* 파란색 밑줄 */
        border-radius: 2px;
    }
`;

export const Section = styled.div`
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const InquiryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ececec; /* 얇은 구분선 */
`;

export const InquiryTitle = styled.h3`
    color: #34495e; /* 어두운 파란색 제목 */
    margin: 0;
    font-size: 1.6em;
`;

export const InquiryMeta = styled.p`
    font-size: 0.95em;
    color: #7f8c8d; /* 회색 텍스트 */
    margin: 0;
    line-height: 1.5;
`;

export const InquiryContent = styled.p`
    font-size: 1.1em;
    color: #34495e;
    line-height: 1.8;
    white-space: pre-wrap;
    padding: 15px 0;
    border-top: 1px dashed #f0f0f0; /* 점선 구분 */
    margin-top: 15px;
`;

export const StatusBadge = styled.span`
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.8em;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    background-color: ${props => {
    switch (props.status) {
        case 'PENDING': return '#f39c12'; /* 오렌지색 */
        case 'ANSWERED': return '#27ae60'; /* 초록색 */
        case 'CLOSED': return '#95a5a6'; /* 회색 */
        default: return '#3498db'; /* 기본 파란색 */
    }
}};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ReplyTitle = styled.h3`
    color: #2c3e50;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ececec;
    font-size: 1.5em;
`;

export const ExistingReply = styled.div`
    background-color: #ecf0f1; /* 밝은 회색 배경 */
    border-left: 6px solid #2ecc71; /* 녹색 강조선 */
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);

    p {
        color: #34495e;
        line-height: 1.7;
        margin-bottom: 10px;
    }
`;

export const ReplyMeta = styled.p`
    font-size: 0.85em;
    color: #7f8c8d;
    margin-top: 15px;
    text-align: right;
    border-top: 1px dashed #e0e0e0;
    padding-top: 10px;
`;

export const ReplyForm = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    gap: 15px; /* 요소 간 간격 */
`;

export const ReplyTextArea = styled.textarea`
    width: 100%;
    padding: 15px;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    min-height: 150px;
    font-size: 1em;
    resize: vertical;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #3498db;
        outline: none;
    }
`;

export const ReplySubmitButton = styled.button`
    padding: 12px 25px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    align-self: flex-end;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

    &:hover {
        background-color: #2980b9;
        transform: translateY(-2px);
    }
    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        box-shadow: none;
        transform: translateY(0);
    }
`;

export const InfoText = styled.p`
    text-align: center;
    font-size: 1.1em;
    color: #555;
    margin-top: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
`;

export const ErrorText = styled(InfoText)`
    color: #e74c3c; /* 빨간색 오류 메시지 */
    background-color: #fdeded;
    border-color: #e74c3c;
`;

export const SuccessText = styled(InfoText)`
    color: #27ae60; /* 초록색 성공 메시지 */
    background-color: #eaf7ed;
    border-color: #27ae60;
`;