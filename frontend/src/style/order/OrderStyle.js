import styled from 'styled-components';

export const OrderContainer = styled.div`
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
`;

export const OrderHeader = styled.h1`
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 2.2em;
    font-weight: 700;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
`;

export const OrderSummary = styled.div`
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;

    h2 {
        color: #555;
        font-size: 1.6em;
        margin-bottom: 15px;
        border-bottom: 1px dashed #ddd;
        padding-bottom: 10px;
    }
`;

export const OrderItemList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const OrderItem = styled.li`
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    &:last-child {
        border-bottom: none;
    }
`;

export const OrderItemImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 15px;
    border: 1px solid #ddd;
`;

export const OrderItemName = styled.span`
    flex-grow: 1;
    font-size: 1.1em;
    font-weight: 600;
    color: #333;
`;

export const OrderItemQuantityPrice = styled.span`
    font-size: 1em;
    color: #666;
    min-width: 180px;
    text-align: right;
`;

export const OrderTotal = styled.div`
    text-align: right;
    font-size: 1.4em;
    font-weight: 700;
    color: #2c3e50;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 2px solid #ddd;
`;

export const PickupTimeSelection = styled.div`
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-bottom: 30px;

    h2 {
        color: #555;
        font-size: 1.6em;
        margin-bottom: 15px;
        border-bottom: 1px dashed #ddd;
        padding-bottom: 10px;
    }
`;

export const InputGroup = styled.div`
    display: flex;
    gap: 20px; /* 입력 필드 사이의 간격 */
    margin-bottom: 15px;
    flex-wrap: wrap; /* 작은 화면에서 줄바꿈 */

    @media (max-width: 768px) {
        flex-direction: column; /* 모바일에서는 세로로 정렬 */
        gap: 10px;
    }
`;

export const DateTimeInput = styled.input`
    flex: 1; /* flex-grow를 사용하여 공간을 균등하게 분배 */
    min-width: 200px; /* 최소 너비 설정 */
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1.1em;
    color: #333;
    box-sizing: border-box; /* 패딩과 보더가 너비에 포함되도록 */
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        outline: none;
    }

    /* Webkit 브라우저의 날짜/시간 입력 필드 스타일 제거 */
    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
        opacity: 1;
        cursor: pointer;
        filter: invert(0.5); /* 아이콘 색상 조정 */
    }
`;

export const PlaceOrderButton = styled.button`
    width: 100%;
    padding: 15px 20px;
    background-color: #4CAF50; /* Green */
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.5em;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #45a049;
        transform: translateY(-2px);
    }

    &:active {
        background-color: #3e8e41;
        transform: translateY(0);
    }
`;

export const ErrorMessage = styled.p`
    color: #d9534f;
    font-size: 0.95em;
    margin-top: 15px;
    text-align: center;
    background-color: #fcecec;
    border: 1px solid #d9534f;
    padding: 10px;
    border-radius: 5px;
    font-weight: 500;
`;