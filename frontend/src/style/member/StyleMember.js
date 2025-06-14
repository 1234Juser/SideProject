import styled from 'styled-components';

// 스타일 컴포넌트 정의
export const SignupContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 50px auto; /* 중앙 정렬 */

    h2 {
        color: #333;
        margin-bottom: 20px;
    }

    form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px; /* 입력 필드 사이 간격 */
    }

    div {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    label {
        margin-bottom: 5px;
        font-weight: bold;
        color: #555;
    }

    input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
        width: 100%;
        box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

        &:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
    }

    button {
        padding: 12px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 10px;

        &:hover {
            background-color: #0056b3;
        }

        &:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    }

    p {
        margin-top: 20px;
        font-size: 16px;
        color: #333;
        text-align: center;
    }

    /* 모바일 반응형 */
    @media (max-width: 768px) {
        max-width: 90%;
        margin: 20px auto;
        padding: 15px;

        h2 {
            font-size: 22px;
        }

        input, button {
            font-size: 15px;
            padding: 10px;
        }
    }

    @media (max-width: 480px) {
        padding: 10px;

        h2 {
            font-size: 20px;
        }

        input, button {
            font-size: 14px;
            padding: 8px;
        }
    }
`;