import React from 'react';
import {
    DetailContainer,
    Title,
    Section,
    SectionTitle,
    InfoRow,
    Label,
    Value,
    ContentText,
    StatusBadge,
    Message
} from '../../style/inquiry/MemberInquiryDetailStyle';

function MemberInquiryDetailCom({ inquiry, isLoading, error }) {
    if (isLoading) {
        return <Message>문의 상세 정보를 불러오는 중...</Message>;
    }

    if (error) {
        return <Message type="error">{error}</Message>;
    }

    if (!inquiry) {
        return <Message type="error">문의 정보를 찾을 수 없습니다.</Message>;
    }

    return (
        <DetailContainer>
            <Title>1:1 문의 상세</Title>

            <Section>
                <SectionTitle>문의 정보</SectionTitle>
                <InfoRow>
                    <Label>문의 번호:</Label>
                    <Value>{inquiry.id}</Value>
                </InfoRow>
                <InfoRow>
                    <Label>제목:</Label>
                    <Value>{inquiry.title}</Value>
                </InfoRow>
                <InfoRow>
                    <Label>상태:</Label>
                    <Value><StatusBadge status={inquiry.status}>{inquiry.status}</StatusBadge></Value>
                </InfoRow>
                <InfoRow>
                    <Label>작성일:</Label>
                    <Value>{new Date(inquiry.createdAt).toLocaleString()}</Value>
                </InfoRow>
                {inquiry.updatedAt && inquiry.createdAt !== inquiry.updatedAt && (
                    <InfoRow>
                        <Label>수정일:</Label>
                        <Value>{new Date(inquiry.updatedAt).toLocaleString()}</Value>
                    </InfoRow>
                )}
            </Section>

            <Section>
                <SectionTitle>문의 내용</SectionTitle>
                <ContentText>{inquiry.content}</ContentText>
            </Section>

            {inquiry.reply ? (
                <Section>
                    <SectionTitle>답변 정보</SectionTitle>
                    <InfoRow>
                        <Label>답변 관리자:</Label>
                        <Value>{inquiry.reply.adminUsername}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>답변일:</Label>
                        <Value>{new Date(inquiry.reply.createdAt).toLocaleString()}</Value>
                    </InfoRow>
                    {inquiry.reply.updatedAt && inquiry.reply.createdAt !== inquiry.reply.updatedAt && (
                        <InfoRow>
                            <Label>답변 수정일:</Label>
                            <Value>{new Date(inquiry.reply.updatedAt).toLocaleString()}</Value>
                        </InfoRow>
                    )}
                    <ContentText>{inquiry.reply.content}</ContentText>
                </Section>
            ) : (
                <Section>
                    <SectionTitle>답변</SectionTitle>
                    <Message>아직 답변이 등록되지 않았습니다.</Message>
                </Section>
            )}
        </DetailContainer>
    );
}

export default MemberInquiryDetailCom;