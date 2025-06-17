import React from 'react';
import {
    InquiryContainer, Title, InquiryTable, TableHeader, TableRow, TableCell,
    StatusBadge, PaginationContainer, PageButton, InfoText, Checkbox, Message, CloseButton
} from '../../style/inquiry/MemberInquiryStyle';


function MemberInquiryCom({
                              inquiries, currentPage, totalPages,
                              isLoading, error, successMessage,
                              selectedInquiryIds, onPageChange,
                              onCheckboxChange, onCloseInquiries
                          }) {

    if (isLoading) {
        return <InfoText>문의 목록을 불러오는 중...</InfoText>;
    }

    if (error) {
        return <Message type="error">오류: {error}</Message>;
    }

    if (!Array.isArray(inquiries)) {
        console.error("문의 데이터가 올바른 배열 형식이 아닙니다:", inquiries);
        return <Message type="error">문의 데이터를 불러오는데 문제가 발생했습니다.</Message>;
    }

    return (
        <InquiryContainer>
            <Title>나의 1:1 문의 목록</Title>
            {successMessage && <Message type="success">{successMessage}</Message>}

            {inquiries.length === 0 ? (
                <InfoText>작성된 문의가 없습니다.</InfoText>
            ) : (
                <>
                    <InquiryTable>
                        <thead>
                        <tr>
                            <TableHeader style={{ width: '5%' }}></TableHeader> {/* Checkbox column */}
                            <TableHeader style={{ width: '10%' }}>ID</TableHeader>
                            <TableHeader style={{ width: '50%' }}>제목</TableHeader>
                            <TableHeader style={{ width: '15%' }}>상태</TableHeader>
                            <TableHeader style={{ width: '20%' }}>작성일</TableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {inquiries.map((inquiry) => (
                            <TableRow key={inquiry.id}>
                                <TableCell>
                                    {/* 문의가 이미 종료되었으면 체크박스 비활성화 */}
                                    <Checkbox
                                        type="checkbox"
                                        checked={selectedInquiryIds.has(inquiry.id)}
                                        onChange={() => onCheckboxChange(inquiry.id)}
                                        disabled={inquiry.status === 'CLOSED'} // Disable if already closed
                                    />
                                </TableCell>
                                <TableCell>{inquiry.id}</TableCell>
                                <TableCell>{inquiry.title}</TableCell>
                                <TableCell>
                                    <StatusBadge status={inquiry.status}>{inquiry.status}</StatusBadge>
                                </TableCell>
                                <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        </tbody>
                    </InquiryTable>

                    <CloseButton
                        onClick={onCloseInquiries}
                        disabled={selectedInquiryIds.size === 0 || isLoading}
                    >
                        선택된 문의 종료
                    </CloseButton>

                    <PaginationContainer>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PageButton
                                key={i}
                                onClick={() => onPageChange(i)}
                                active={i === currentPage}
                                disabled={isLoading}
                            >
                                {i + 1}
                            </PageButton>
                        ))}
                    </PaginationContainer>
                </>
            )}
        </InquiryContainer>
    );
}

export default MemberInquiryCom;
