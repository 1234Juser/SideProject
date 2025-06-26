import styled from 'styled-components';

export const CartContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 40px auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const CartHeader = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 2em;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
`;

export const CartItemList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const CartItem = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const CartItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 15px;
`;

export const CartItemDetails = styled.div`
    flex-grow: 1;
`;

export const CartItemName = styled.h3`
    margin: 0;
    font-size: 1.2em;
    color: #555;
`;

export const CartItemQuantity = styled.p`
    margin: 5px 0;
    color: #777;
`;

export const CartItemPrice = styled.p`
    margin: 0;
    font-weight: bold;
    color: #333;
    font-size: 1.1em;
`;

export const CartActions = styled.div`
    display: flex;
    gap: 10px;
    margin-left: 20px;
`;

export const QuantityButton = styled.button`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #eee;
    cursor: pointer;
    font-size: 1em;
    &:hover {
        background-color: #ddd;
    }
`;

export const RemoveButton = styled.button`
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    background-color: #dc3545;
    color: white;
    cursor: pointer;
    font-size: 1em;
    &:hover {
        background-color: #c82333;
    }
`;

export const CartTotal = styled.div`
    text-align: right;
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 30px;
    padding-top: 15px;
    border-top: 2px solid #eee;
    color: #333;
`;

export const CheckoutButton = styled.button`
    display: block;
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.2em;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

export const NoCartItems = styled.p`
    text-align: center;
    font-size: 1.2em;
    color: #777;
    margin-top: 50px;
`;