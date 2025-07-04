import styled from 'styled-components';
import { ErrorMessage } from '../../style/order/OrderStyle'; // ErrorMessage import 유지

// PaymentHistoryContainer: 결제 내역 페이지 전체를 감싸는 컨테이너
export const PaymentHistoryContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', sans-serif;
`;

// PaymentHistoryHeader: 결제 내역 페이지의 제목 스타일
export const PaymentHistoryHeader = styled.h1`
    font-size: 2.2em;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 700;
`;

// PaymentList: 결제 항목들을 담는 ul 태그 스타일
export const PaymentList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

// PaymentItem: 개별 결제 항목(li 태그) 스타일
export const PaymentItem = styled.li`
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 15px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    cursor: pointer; /* 클릭 가능하도록 커서 변경 */

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
`;

export const PaymentDetail = styled.p`
    font-size: 1em;
    color: #555;
    margin: 0;
    strong {
        color: #333;
        font-weight: 600;
    }
`;

export const PaymentAmount = styled(PaymentDetail)`
    font-size: 1.2em;
    font-weight: 700;
    color: #28a745; /* 녹색 */
`;

export const PaymentStatus = styled(PaymentDetail)`
    font-weight: 600;
    color: ${props => {
    switch (props.status) {
        case 'PAID': return '#28a745'; // 결제 완료
        case 'FAILED': return '#dc3545'; // 결제 실패
        case 'CANCELLED': return '#ffc107'; // 결제 취소
        case 'PENDING': return '#007bff'; // 결제 대기
        default: return '#6c757d'; // 기본
    }
}};
`;

export const NoPaymentMessage = styled.p`
    text-align: center;
    color: #888;
    font-size: 1.1em;
    padding: 30px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    margin-top: 20px;
`;

export const ErrorMessageStyled = styled(ErrorMessage)`
    text-align: center;
    margin-top: 20px;
`;

export const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
`;

export const CancelButton = styled.button`
    background-color: #dc3545;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c82333;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

export const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

export const StyledCheckbox = styled.input`
    margin-right: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
`;
