import styled from 'styled-components';

export const LoginContainer = styled.div`
    max-width: 400px;
    margin: 100px auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

    @media (max-width: 768px) {
        margin: 50px auto;
        padding: 1.5rem;
    }

    @media (max-width: 480px) {
        width: 90%;
        padding: 1rem;
    }

    input {
        width: 100%;
        padding: 0.6rem;
        margin-top: 5px;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
    }

    button {
        width: 100%;
        padding: 0.8rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;

        &:disabled {
            background: #aaa;
            cursor: not-allowed;
        }
    }

    label {
        font-weight: bold;
    }

    p {
        margin-top: 1rem;
        color: red;
    }
`;