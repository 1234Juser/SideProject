import React from 'react';
import {
    DetailContainer,
    Title,
    Section,
    InquiryHeader,
    InquiryTitle,
    InquiryMeta,
    InquiryContent,
    StatusBadge,
    ReplyTitle,
    ExistingReply,
    ReplyMeta,
    ReplyForm,
    ReplyTextArea,
    ReplySubmitButton,
    InfoText,
    ErrorText,
    SuccessText
} from '../../style/inquiry/AdminInquiryDetailStyle';

function AdminInquiryDetailCom({
                                   inquiry,
                                   replyContent,
                                   setReplyContent,
                                   handleSubmitReply,
                                   isLoading,
                                   error,
                                   success
                               }) {
    if (isLoading) {
        return <InfoText>문의 상세 정보를 불러오는 중...</InfoText>;
    }

    if (error) {
        return <ErrorText>오류: {error}</ErrorText>;
    }

    if (!inquiry) {
        return <InfoText>문의 정보를 찾을 수 없습니다.</InfoText>;
    }

    return (
        <DetailContainer>
            <Title>1:1 문의 상세</Title>

            <Section>
                <InquiryHeader>
                    <InquiryTitle>{inquiry.title}</InquiryTitle>
                    <StatusBadge status={inquiry.status}>{inquiry.status}</StatusBadge>
                </InquiryHeader>
                <InquiryMeta>
                    작성자: {inquiry.authorNickname} | 작성일: {new Date(inquiry.createdAt).toLocaleString()}
                </InquiryMeta>
                <InquiryContent>{inquiry.content}</InquiryContent>
            </Section>

            <Section>
                <ReplyTitle>답변</ReplyTitle>
                {inquiry.reply ? (
                    <ExistingReply>
                        <p>{inquiry.reply.content}</p>
                        <ReplyMeta>
                            답변자: {inquiry.reply.adminUsername} | 답변일: {new Date(inquiry.reply.createdAt).toLocaleString()}
                        </ReplyMeta>
                    </ExistingReply>
                ) : (
                    <InfoText>아직 등록된 답변이 없습니다.</InfoText>
                )}

                <ReplyForm onSubmit={handleSubmitReply}>
                    <ReplyTextArea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답변 내용을 입력하세요..."
                        disabled={isLoading}
                    />
                    <ReplySubmitButton type="submit" disabled={isLoading}>
                        {inquiry.reply ? '답변 수정' : '답변 등록'}
                    </ReplySubmitButton>
                </ReplyForm>

                {error && <ErrorText>{error}</ErrorText>}
                {success && <SuccessText>{success}</SuccessText>}
            </Section>
        </DetailContainer>
    );
}

export default AdminInquiryDetailCom;