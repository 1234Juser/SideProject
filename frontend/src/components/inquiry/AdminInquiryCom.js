import React from 'react';
import {
    InquiryContainer, Title, InquiryTable, TableHeader, TableRow, TableCell,
    StatusBadge, PaginationContainer, PageButton, InfoText
} from '../../style/inquiry/AdminInquiryStyle';

function AdminInquiryCom({
                             inquiries, currentPage, totalPages,
                             isLoading, error,
                             handlePageChange, handleRowClick
                         }) {
    if (isLoading) {
        return <InfoText>문의 목록을 불러오는 중...</InfoText>;
    }

    if (error) {
        return <InfoText style={{ color: 'red' }}>오류: {error}</InfoText>;
    }

    // inquiries가 배열이 아닐 경우 (예: undefined, null 등) 오류 메시지를 표시합니다.
    if (!Array.isArray(inquiries)) {
        console.error("문의 데이터가 올바른 배열 형식이 아닙니다:", inquiries);
        return <InfoText style={{ color: 'red' }}>문의 데이터를 불러오는데 문제가 발생했습니다.</InfoText>;
    }

    return (
        <InquiryContainer>
            <Title>관리자 1:1 문의 관리</Title>
            {/* inquiries 배열이 비어있으면 "등록된 문의가 없습니다." 메시지를 표시합니다. */}
            {inquiries.length === 0 ? (
                <InfoText>등록된 문의가 없습니다.</InfoText>
            ) : (
                <InquiryTable>
                    <thead>
                    <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>제목</TableHeader>
                        <TableHeader>작성자</TableHeader>
                        <TableHeader>상태</TableHeader>
                        <TableHeader>작성일</TableHeader>
                    </tr>
                    </thead>
                    <tbody>
                    {/* 문의 데이터를 매핑하여 각 행을 렌더링합니다. */}
                    {inquiries.map((inquiry) => (
                        <TableRow key={inquiry.id} onClick={() => handleRowClick(inquiry.id)}>
                            <TableCell>{inquiry.id}</TableCell>
                            <TableCell>{inquiry.title}</TableCell>
                            <TableCell>{inquiry.authorNickname}</TableCell>
                            <TableCell>
                                <StatusBadge status={inquiry.status}>{inquiry.status}</StatusBadge>
                            </TableCell>
                            <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                    </tbody>
                </InquiryTable>
            )}

            <PaginationContainer>
                {Array.from({ length: totalPages }, (_, i) => (
                    <PageButton
                        key={i}
                        onClick={() => handlePageChange(i)}
                        active={i === currentPage}
                        disabled={isLoading}
                    >
                        {i + 1}
                    </PageButton>
                ))}
            </PaginationContainer>
        </InquiryContainer>
    );
}

export default AdminInquiryCom;