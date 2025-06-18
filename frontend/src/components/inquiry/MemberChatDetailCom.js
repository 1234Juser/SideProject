import React from 'react';
import {
    DetailContainer,
    DetailTitle,
    SessionOverview,
    SessionInfoText,
    SessionDetailStatus,
    MessageList,
    MessageBox,
    MessageSender,
    MessageText,
    MessageTimestamp,
    LoadingMessage,
    ErrorMessage,
    NoMessages,
    BackButton
} from '../../style/inquiry/MemberChatDetailStyle'; // 스타일 파일 임포트

function MemberChatDetailCom({ chatSession, isLoading, error, onBackClick, currentMemberId }) {
    if (isLoading) {
        return <LoadingMessage>채팅 상세 정보를 불러오는 중입니다...</LoadingMessage>;
    }

    if (error) {
        return <ErrorMessage>오류: {error}</ErrorMessage>;
    }

    if (!chatSession) {
        return <ErrorMessage>채팅 세션을 찾을 수 없습니다.</ErrorMessage>;
    }

    return (
        <DetailContainer>
            <DetailTitle>1:1 문의 상세</DetailTitle>

            <SessionOverview>
                <SessionInfoText><strong>문의 번호:</strong> #{chatSession.sessionId}</SessionInfoText>
                <SessionInfoText><strong>작성자:</strong> {chatSession.memberNickname}</SessionInfoText>
                <SessionInfoText><strong>생성일:</strong> {new Date(chatSession.createdAt).toLocaleString()}</SessionInfoText>
                <SessionDetailStatus $status={chatSession.status}>{chatSession.status}</SessionDetailStatus>
            </SessionOverview>

            <h3 style={{color: '#333d4b', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>대화 내용</h3>
            <MessageList>
                {chatSession.messages && chatSession.messages.length > 0 ? (
                    chatSession.messages.map((message) => {
                        const isUser = message.senderId === currentMemberId; // 현재 로그인한 사용자가 보낸 메시지인지 확인
                        return (
                            <MessageBox key={message.messageId} $isUser={isUser}>
                                <MessageSender $isUser={isUser}>
                                    {isUser ? '나' : message.senderNickname}
                                </MessageSender>
                                <MessageText>{message.message}</MessageText>
                                <MessageTimestamp $isUser={isUser}>
                                    {new Date(message.createdAt).toLocaleString()}
                                </MessageTimestamp>
                            </MessageBox>
                        );
                    })
                ) : (
                    <NoMessages>아직 대화 내용이 없습니다.</NoMessages>
                )}
            </MessageList>
            <BackButton onClick={onBackClick}>목록으로 돌아가기</BackButton>
        </DetailContainer>
    );
}

export default MemberChatDetailCom;