import styled from 'styled-components';

export const FormContainer = styled.div`
    background-color: #ffffff;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
`;

export const FormGroup = styled.div`
    margin-bottom: 15px;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
`;

export const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }
`;

export const CheckboxGroup = styled.div`
    margin-top: 15px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    input[type="checkbox"] {
        margin-right: 10px;
        width: 20px; /* 크기 조절 */
        height: 20px; /* 크기 조절 */
    }

    label {
        margin-bottom: 0;
        font-weight: normal;
        color: #555;
    }
`;

export const ErrorText = styled.p`
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 5px;
`;

export const SuccessText = styled.p`
    color: #28a745;
    font-size: 1rem;
    margin-top: 15px;
    font-weight: bold;
`;

// 기존 EditButton은 그대로 재활용
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