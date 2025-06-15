import styled from 'styled-components';

export const InquiryWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px; /* 상하 패딩 증가 */
    background-color: #f0f2f5; /* 더 부드러운 회색 배경 */
    min-height: calc(100vh - 150px);
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; /* 폰트 변경 */
`;

export const InquiryForm = styled.form`
    width: 100%;
    max-width: 750px; /* 최대 너비 약간 증가 */
    display: flex;
    flex-direction: column;
    gap: 25px; /* 요소 간 간격 증가 */
    padding: 50px; /* 내부 패딩 증가 */
    background-color: #ffffff;
    border-radius: 16px; /* 더 둥근 테두리 */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 더 깊고 부드러운 그림자 */
    border: 1px solid #e0e0e0; /* 미묘한 테두리 추가 */
`;

export const FormTitle = styled.h2`
    text-align: center;
    color: #2c3e50; /* 진한 회색 */
    margin-bottom: 30px; /* 제목 하단 마진 증가 */
    font-size: 36px; /* 글꼴 크기 증가 */
    font-weight: 700;
    letter-spacing: -0.5px; /* 글자 간격 조정 */
`;

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px; /* 라벨과 입력 필드 간 간격 조정 */
`;

export const Label = styled.label`
    font-weight: 600;
    color: #34495e; /* 어두운 회색 */
    font-size: 17px; /* 글꼴 크기 약간 증가 */
`;

export const StyledInput = styled.input`
    padding: 15px; /* 패딩 증가 */
    border: 1px solid #dcdcdc; /* 미묘한 테두리 */
    border-radius: 10px; /* 둥근 테두리 */
    font-size: 16px;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease; /* 전환 효과 추가 */

    &:focus {
        outline: none;
        border-color: #6c5ce7; /* 보라색 계열로 변경 */
        box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2); /* 포커스 시 그림자 추가 */
    }

    &::placeholder {
        color: #a0a0a0;
    }
`;

export const StyledTextarea = styled.textarea`
    padding: 15px; /* 패딩 증가 */
    border: 1px solid #dcdcdc; /* 미묘한 테두리 */
    border-radius: 10px; /* 둥근 테두리 */
    font-size: 16px;
    min-height: 200px; /* 최소 높이 조정 */
    resize: vertical;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease; /* 전환 효과 추가 */

    &:focus {
        outline: none;
        border-color: #6c5ce7; /* 보라색 계열로 변경 */
        box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2); /* 포커스 시 그림자 추가 */
    }

    &::placeholder {
        color: #a0a0a0;
    }
`;

export const SubmitButton = styled.button`
    padding: 16px 25px; /* 패딩 증가 */
    border: none;
    border-radius: 10px; /* 둥근 테두리 */
    background-color: #6c5ce7; /* 보라색 계열 */
    color: white;
    font-size: 19px; /* 글꼴 크기 증가 */
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease; /* 전환 효과 추가 */
    box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3); /* 버튼 그림자 추가 */

    &:hover {
        background-color: #5d4be1; /* 호버 시 약간 어두워짐 */
        transform: translateY(-2px); /* 호버 시 약간 위로 이동 */
    }

    &:disabled {
        background-color: #cccccc;
        box-shadow: none;
        cursor: not-allowed;
        transform: translateY(0);
    }
`;

export const Message = styled.p`
    text-align: center;
    font-size: 15px;
    padding: 12px;
    border-radius: 8px; /* 둥근 테두리 */
    color: white;
    background-color: ${props => props.type === 'error' ? '#e74c3c' : '#2ecc71'}; /* 더 부드러운 에러/성공 색상 */
    margin-bottom: 20px; /* 메시지 하단 마진 추가 */
    font-weight: 500;
`;