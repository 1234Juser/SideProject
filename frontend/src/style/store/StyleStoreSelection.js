import styled from 'styled-components';

export const StorePageContainer = styled.div`
    padding: 20px;
    font-family: 'Arial', sans-serif;
`;

export const StoreTitle = styled.h1`
    text-align: center;
    color: #333;
    margin-bottom: 30px;
`;

export const StoreList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
`;

export const StoreCard = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background-color: ${props => props.isSelected ? '#e6f7ff' : '#fff'};
    box-shadow: ${props => props.isSelected ? '0 0 0 2px #007bff' : 'none'};

    &:hover {
        border-color: #007bff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
`;

export const StoreName = styled.h3`
    color: #007bff;
    margin-bottom: 5px;
`;

export const StoreAddress = styled.p`
    font-size: 0.9em;
    color: #555;
    margin-bottom: 5px;
`;

export const StoreInfo = styled.p`
    font-size: 0.85em;
    color: #777;
`;

export const StoreSelectButton = styled.button`
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #28a745;
    color: white;
    font-size: 1.2em;
    border: none;
    border-radius: 8px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    margin-top: 30px;

    &:hover {
        background-color: ${props => props.disabled ? '#28a745' : '#218838'};
    }
    &:disabled {
        opacity: 0.6;
    }
`;