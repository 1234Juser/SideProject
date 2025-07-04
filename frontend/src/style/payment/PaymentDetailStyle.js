import styled from 'styled-components';

// PaymentDetailContainer: 결제 상세 페이지 전체를 감싸는 컨테이너
export const PaymentDetailContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', sans-serif;
`;

// PaymentDetailHeader: 결제 상세 페이지의 제목 스타일
export const PaymentDetailHeader = styled.h1`
    font-size: 2.2em;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 700;
`;

// DetailSection: 결제 상세 정보 섹션 스타일
export const DetailSection = styled.div`
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
`;

// DetailItem: 상세 정보 항목 텍스트 스타일
export const DetailItem = styled.p`
    font-size: 1.1em;
    color: #333;
    margin: 8px 0;
    strong {
        color: #000;
        font-weight: 600;
        margin-right: 5px;
    }
`;

// OrderItemSection: 주문 상품 내역 섹션 스타일
export const OrderItemSection = styled.div`
    margin-top: 20px;
    border-top: 1px dashed #e0e0e0;
    padding-top: 20px;
`;

// OrderItemTitle: 주문 상품 내역 제목 스타일
export const OrderItemTitle = styled.h3`
    font-size: 1.5em;
    color: #333;
    margin-bottom: 15px;
    text-align: center;
`;

// OrderItemListStyled: 주문 상품 목록(ul) 스타일
export const OrderItemListStyled = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

// OrderItemStyled: 개별 주문 상품 항목(li) 스타일
export const OrderItemStyled = styled.li`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 0;
    border-bottom: 1px dashed #eee;

    &:last-child {
        border-bottom: none;
    }
`;

// OrderItemImageStyled: 주문 상품 이미지 스타일
export const OrderItemImageStyled = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #ddd;
`;

// OrderItemDetails: 주문 상품 상세 정보 텍스트 컨테이너 스타일
export const OrderItemDetails = styled.div`
    flex-grow: 1;
`;

// OrderItemNameStyled: 주문 상품 이름 스타일
export const OrderItemNameStyled = styled.p`
    font-size: 1.1em;
    font-weight: 600;
    color: #333;
    margin: 0 0 5px 0;
`;

// OrderItemQuantityPriceStyled: 주문 상품 수량 및 가격 스타일
export const OrderItemQuantityPriceStyled = styled.p`
    font-size: 0.95em;
    color: #666;
    margin: 0;
`;

// BackButton: 목록으로 돌아가기 버튼 스타일
export const BackButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: block;
    margin: 30px auto 0;

    &:hover {
        background-color: #0056b3;
    }
`;

export const PaymentStatusDetail = styled(DetailItem)`
    font-weight: 600;
    color: ${props => {
    switch (props.status) {
        case 'PAID': return '#28a745';
        case 'FAILED': return '#dc3545';
        case 'CANCELLED': return '#ffc107';
        case 'PENDING': return '#007bff';
        default: return '#6c757d';
    }
}};
`;
