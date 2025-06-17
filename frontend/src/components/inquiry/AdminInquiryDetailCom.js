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
    SuccessText,
    ReplyActionButton
} from '../../style/inquiry/AdminInquiryDetailStyle';

function AdminInquiryDetailCom({
                                   inquiry,
                                   replyContent,
                                   setReplyContent,
                                   handleSubmitReply,
                                   handleDeleteReply,
                                   isLoading,
                                   error,
                                   success,
                                   loggedInAdminUsername
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

    // 문의가 종료되었는지 확인
    const isClosed = inquiry.status === 'CLOSED';
    // 현재 로그인한 관리자가 답변 작성자인지 확인
    const isReplyOwner = inquiry.reply && inquiry.reply.admin && inquiry.reply.admin.memberUsername === loggedInAdminUsername;

    return (
        <DetailContainer>
            <Title>1:1 문의 상세</Title>

            {success && <SuccessText>{success}</SuccessText>}
            {error && <ErrorText>{error}</ErrorText>}

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
                    // 답변이 존재하는 경우 (문의 상태와 상관없이 항상 답변 내용을 표시)
                    <ExistingReply>
                        {inquiry.reply.admin && (
                            <ReplyMeta>
                                답변자: {inquiry.reply.admin.memberUsername} | 답변일: {new Date(inquiry.reply.createdAt).toLocaleString()}
                            </ReplyMeta>
                        )}
                        <InquiryContent>{inquiry.reply.content}</InquiryContent>

                        {/* 문의가 종료되지 않았을 때만 답변 수정/삭제 관련 UI 표시 */}
                        {!isClosed ? (
                            isReplyOwner ? (
                                <form onSubmit={handleSubmitReply}>
                                    <ReplyTextArea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="답변 내용을 수정하세요..."
                                        rows="5"
                                    />
                                    <ReplySubmitButton type="submit">답변 수정</ReplySubmitButton>
                                    <ReplyActionButton type="button" onClick={handleDeleteReply}>답변 삭제</ReplyActionButton>
                                </form>
                            ) : (
                                <InfoText>이 답변은 다른 관리자가 작성했습니다. 수정/삭제할 수 없습니다.</InfoText>
                            )
                        ) : (
                            // 문의가 종료되었을 때 (답변 내용만 보이고 수정/삭제 불가 메시지 표시)
                            <InfoText>이 문의는 종료되었으므로 답변을 수정하거나 삭제할 수 없습니다.</InfoText>
                        )}
                    </ExistingReply>
                ) : (
                    // 답변이 존재하지 않는 경우
                    !isClosed ? (
                        // 문의가 종료되지 않았을 때만 새로운 답변 작성 폼 표시
                        <ReplyForm onSubmit={handleSubmitReply}>
                            <ReplyTextArea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="답변 내용을 입력하세요..."
                                rows="5"
                            />
                            <ReplySubmitButton type="submit">답변 등록</ReplySubmitButton>
                        </ReplyForm>
                    ) : (
                        // 답변이 없고 문의가 종료되었을 때
                        <InfoText>아직 답변이 등록되지 않았습니다. 종료된 문의에는 답변을 작성할 수 없습니다.</InfoText>
                    )
                )}
            </Section>
        </DetailContainer>
    );
}

export default AdminInquiryDetailCom;