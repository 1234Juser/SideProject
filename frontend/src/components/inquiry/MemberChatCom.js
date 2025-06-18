import React from 'react';
import {
    ChatContainer,
    Title,
    SessionList,
    SessionItem,
    SessionInfo,
    SessionId,
    SessionDate,
    SessionStatus,
    EmptyMessage,
    ErrorMessage,
    LoadingMessage
} from '../../style/inquiry/MemberChatStyle';

function MemberChatCom({ chatSessions, isLoading, error, onSessionClick }) {
    if (isLoading) {
        return <LoadingMessage>채팅 세션 목록을 불러오는 중입니다...</LoadingMessage>;
    }

    if (error) {
        return <ErrorMessage>오류: {error}</ErrorMessage>;
    }

    return (
        <ChatContainer>
            <Title>나의 1:1 문의 내역</Title>
            {chatSessions.length === 0 ? (
                <EmptyMessage>아직 작성된 1:1 채팅 문의가 없습니다.</EmptyMessage>
            ) : (
                <SessionList>
                    {chatSessions.map((session) => (
                        <SessionItem key={session.sessionId} onClick={() => onSessionClick(session.sessionId)}>
                            <SessionInfo>
                                <SessionId>문의 번호: #{session.sessionId}</SessionId>
                                {/* 백엔드 DTO에 memberNickname이 포함되어 있으므로 여기에 표시 가능 */}
                                {session.memberNickname && <p style={{color: '#5a677a', fontSize: '0.95em'}}>작성자: {session.memberNickname}</p>}
                                <SessionDate>생성일: {new Date(session.createdAt).toLocaleString()}</SessionDate>
                            </SessionInfo>
                            <SessionStatus $status={session.status}>{session.status}</SessionStatus>
                        </SessionItem>
                    ))}
                </SessionList>
            )}
        </ChatContainer>
    );
}

export default MemberChatCom;