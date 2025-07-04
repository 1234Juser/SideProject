import React from 'react';
import {
    DetailContainer,
    DetailHeader,
    ProductSummary,
    ProductImageStyled,
    ProductInfoStyled,
    ProductNameStyled,
    ProductStats,
    SectionTitle,
    UserPaymentTable,
    NoDataMessage,
    ErrorMessageStyled,
    BackButton
} from '../../style/payment/AdminPaymentDetailStyle';

function AdminPaymentDetailCom({ selectedProduct, userPaymentsForProduct, loading, error, handleBackClick }) {
    if (loading) {
        return (
            <DetailContainer>
                <DetailHeader>상세 내역을 불러오는 중입니다...</DetailHeader>
            </DetailContainer>
        );
    }

    if (error) {
        return (
            <DetailContainer>
                <DetailHeader>오류 발생</DetailHeader>
                <ErrorMessageStyled>{error}</ErrorMessageStyled>
                <BackButton onClick={handleBackClick}>목록으로 돌아가기</BackButton>
            </DetailContainer>
        );
    }

    if (!selectedProduct) {
        return (
            <DetailContainer>
                <DetailHeader>상품 정보를 찾을 수 없습니다.</DetailHeader>
                <NoDataMessage>유효하지 않은 접근이거나 상품 정보가 없습니다.</NoDataMessage>
                <BackButton onClick={handleBackClick}>목록으로 돌아가기</BackButton>
            </DetailContainer>
        );
    }

    return (
        <DetailContainer>
            <DetailHeader>상품별 결제 상세 내역</DetailHeader>

            <ProductSummary>
                {selectedProduct.imageUrl ? (
                    <ProductImageStyled src={`http://localhost:8080${selectedProduct.imageUrl}`} alt={selectedProduct.menuName} />
                ) : (
                    <ProductImageStyled src="https://placehold.co/100x100/cccccc/ffffff?text=No+Img" alt="No Image" />
                )}
                <ProductInfoStyled>
                    <ProductNameStyled>{selectedProduct.menuName}</ProductNameStyled>
                    <ProductStats>
                        <strong>총 판매 수량:</strong> {selectedProduct.totalQuantity}개
                    </ProductStats>
                    <ProductStats>
                        <strong>총 판매 금액:</strong> {selectedProduct.totalAmount?.toLocaleString()}원
                    </ProductStats>
                </ProductInfoStyled>
            </ProductSummary>

            <SectionTitle>'{selectedProduct.menuName}' 구매자 결제 내역</SectionTitle>
            {userPaymentsForProduct.length === 0 ? (
                <NoDataMessage>선택된 상품을 구매한 사용자 결제 내역이 없습니다.</NoDataMessage>
            ) : (
                <UserPaymentTable>
                    <thead>
                    <tr>
                        <th>결제 ID</th>
                        <th>거래 번호</th>
                        <th>사용자 ID</th>
                        <th>사용자명</th>
                        <th>결제 금액</th>
                        <th>상태</th>
                        <th>결제일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userPaymentsForProduct.map(payment => (
                        <tr key={payment.paymentId}>
                            <td>{payment.paymentId}</td>
                            <td>{payment.impUid}</td>
                            <td>{payment.memberId}</td>
                            <td>{payment.memberUsername}</td>
                            <td>{payment.paymentAmount?.toLocaleString()}원</td>
                            <td>{payment.paymentStatus}</td>
                            <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleString('ko-KR') : 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </UserPaymentTable>
            )}

            <BackButton onClick={handleBackClick}>목록으로 돌아가기</BackButton>
        </DetailContainer>
    );
}

export default AdminPaymentDetailCom;
