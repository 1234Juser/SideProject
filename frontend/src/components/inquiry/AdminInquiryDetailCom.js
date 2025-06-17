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
    ReplyActionButton // ReplyActionButton 추가
} from '../../style/inquiry/AdminInquiryDetailStyle';

function AdminInquiryDetailCom({
                                   inquiry,
                                   replyContent,
                                   setReplyContent,
                                   handleSubmitReply,
                                   handleDeleteReply, // 새로운 prop 받기
                                   isLoading,
                                   error,
                                   success,
                                   loggedInAdminUsername // 새로운 prop 받기
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

    // --- 디버깅을 위한 console.log 추가 ---
    console.log("inquiry.reply:", inquiry.reply);
    if (inquiry.reply && inquiry.reply.admin) {
        console.log("inquiry.reply.admin.memberUsername:", `'${inquiry.reply.admin.memberUsername}'`);
    } else {
        console.log("inquiry.reply.admin is undefined or null.");
    }
    console.log("loggedInAdminUsername:", `'${loggedInAdminUsername}'`);
    console.log("isReplyOwner:", isReplyOwner);
    // --- console.log 추가 끝 ---

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
                {/* 문의가 종료되었는지 확인 */}
                {isClosed ? (
                    <InfoText>종료된 문의에는 답변을 작성하거나 수정할 수 없습니다.</InfoText>
                ) : (
                    // 문의가 종료되지 않은 경우
                    <>
                        {inquiry.reply ? (
                            // 기존 답변이 있는 경우
                            <ExistingReply>
                                {/* inquiry.reply.admin이 존재할 때만 ReplyMeta를 렌더링합니다. */}
                                {inquiry.reply.admin && (
                                    <ReplyMeta>
                                        답변자: {inquiry.reply.admin.memberUsername} | 답변일: {new Date(inquiry.reply.createdAt).toLocaleString()}
                                    </ReplyMeta>
                                )}
                                {/* 답변자가 현재 로그인한 관리자인 경우 수정 가능한 입력창 */}
                                {isReplyOwner ? (
                                    <form onSubmit={handleSubmitReply}>
                                        <ReplyTextArea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="답변 내용을 입력하세요..."
                                            rows="5"
                                        />
                                        <ReplySubmitButton type="submit">답변 수정</ReplySubmitButton>
                                        <ReplyActionButton type="button" onClick={handleDeleteReply}>답변 삭제</ReplyActionButton>
                                    </form>
                                ) : (
                                    // 답변자가 다른 관리자인 경우 읽기 전용으로 표시
                                    <>
                                        <InquiryContent>{inquiry.reply.content}</InquiryContent>
                                        <InfoText>이 답변은 다른 관리자가 작성했습니다. 수정/삭제할 수 없습니다.</InfoText>
                                    </>
                                )}
                            </ExistingReply>
                        ) : (
                            // 기존 답변이 없는 경우 새로운 답변 작성 폼
                            <ReplyForm onSubmit={handleSubmitReply}>
                                <ReplyTextArea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="답변 내용을 입력하세요..."
                                    rows="5"
                                />
                                <ReplySubmitButton type="submit">답변 등록</ReplySubmitButton>
                            </ReplyForm>
                        )}
                    </>
                )}
            </Section>
        </DetailContainer>
    );
}

export default AdminInquiryDetailCom;