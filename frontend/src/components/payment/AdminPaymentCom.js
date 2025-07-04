import React from 'react';
import {
    AdminPaymentContainer,
    AdminPaymentHeader,
    DatePickerContainer,
    SectionTitle,
    ProductList,
    ProductItem,
    ProductImage,
    ProductInfo,
    ProductName,
    ProductTotalSales,
    NoDataMessage,
    ErrorMessage
} from '../../style/payment/AdminPaymentStyle';
import { useNavigate } from 'react-router-dom';

function AdminPaymentCom({
                             selectedDate,
                             paymentsByDate,
                             loading,
                             error,
                             handleDateChange,
                         }) {

    const navigate = useNavigate();

    //  handleProductClick 함수를 직접 여기서 정의하여 navigate 로직 추가
    const onProductClick = (product) => {
        // 선택된 상품 정보를 URL 파라미터나 state로 전달하여 상세 페이지로 이동
        navigate(`/adminmypage/payment/detail/${product.productId}`, {
            state: {
                selectedProduct: product, // 선택된 상품 정보 자체를 state로 전달
                selectedDate: selectedDate // 선택된 날짜도 함께 전달
            }
        });
    };

    if (loading) {
        return (
            <AdminPaymentContainer>
                <AdminPaymentHeader>데이터를 불러오는 중입니다...</AdminPaymentHeader>
            </AdminPaymentContainer>
        );
    }

    return (
        <AdminPaymentContainer>
            <AdminPaymentHeader>관리자 결제 내역</AdminPaymentHeader>

            <DatePickerContainer>
                <label htmlFor="paymentDate">날짜 선택:</label>
                <input
                    type="date"
                    id="paymentDate"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </DatePickerContainer>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {/* 날짜별 상품 판매 현황 */}
            <SectionTitle>{selectedDate} 상품 판매 현황</SectionTitle>
            {paymentsByDate.length === 0 && !loading && !error ? (
                <NoDataMessage>메뉴 정보를 불러올 수 없거나 표시할 상품이 없습니다.</NoDataMessage>
            ) : (
                <ProductList>
                    {paymentsByDate.map(product => (
                        //  onClick 핸들러를 onProductClick으로 변경
                        <ProductItem key={product.productId} onClick={() => onProductClick(product)}>
                            {product.imageUrl ? (
                                <ProductImage src={`http://localhost:8080${product.imageUrl}`} alt={product.menuName} />
                            ) : (
                                <ProductImage src="https://placehold.co/60x60/cccccc/ffffff?text=No+Img" alt="No Image" />
                            )}
                            <ProductInfo>
                                <ProductName>{product.menuName}</ProductName>
                                <ProductTotalSales>
                                    총 판매 수량: {product.totalQuantity}개, 총 판매 금액: {product.totalAmount?.toLocaleString()}원
                                </ProductTotalSales>
                            </ProductInfo>
                        </ProductItem>
                    ))}
                </ProductList>
            )}


        </AdminPaymentContainer>
    );
}

export default AdminPaymentCom;
