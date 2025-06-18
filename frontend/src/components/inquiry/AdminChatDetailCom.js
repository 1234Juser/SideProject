import React from 'react';
import {
    ChatWrapper,
    ChatHeader,
    MessageContainer,
    MessageBubble,
    MessageMeta,
    ChatForm,
    ChatInput,
    SendButton,
    StatusMessage,
    EndChatButton
} from '../../style/inquiry/ChatStyle';
import { formatDateTime } from '../../utils/ChatUtils';

function AdminChatDetailCom({
                                messages,
                                newMessage,
                                setNewMessage,
                                handleSendMessage,
                                isLoading,
                                error,
                                adminUsername, // 관리자 닉네임 (로그인된 사용자)
                                messagesEndRef,
                                session,
                                stompClientActive,
                                handleCloseChat,
                                isChatClosed
                            }) {

    if (isLoading) {
        return <ChatWrapper><StatusMessage>채팅방 로딩 중...</StatusMessage></ChatWrapper>;
    }

    if (error) {
        return <ChatWrapper><StatusMessage className="error">오류: {error}</StatusMessage></ChatWrapper>;
    }

    // Shift + Enter 처리 함수
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 기본 Enter 동작(줄 바꿈) 방지
            handleSendMessage(); // 메시지 전송
        }
    };

    // 채팅이 종료되었을 때 표시할 메시지 목록 (종료 메시지 추가)
    let displayMessages = messages;
    if (isChatClosed) {
        displayMessages = [
            ...messages, // 기존 메시지 유지
            {
                messageId: 'system-closed',
                senderNickname: '시스템',
                message: '이 채팅방은 종료되었습니다.',
                createdAt: new Date().toISOString(),
                isSystem: true // 시스템 메시지임을 나타내는 플래그
            }
        ];
    }

    return (
        <ChatWrapper>
            <ChatHeader>
                {session ? `${session.memberNickname} 님과의 채팅` : '채팅 상세'}
                {session && session.status !== 'CLOSED' && (
                    <EndChatButton onClick={handleCloseChat} disabled={!stompClientActive}>
                        채팅 종료
                    </EndChatButton>
                )}
            </ChatHeader>

            <MessageContainer>
                {displayMessages.length === 0 ? ( // 이제 displayMessages를 사용합니다.
                    <StatusMessage>메시지가 없습니다.</StatusMessage>
                ) : (
                    displayMessages.map((msg, index) => (
                        <MessageBubble
                            key={msg.messageId || index}
                            isMine={msg.senderType === 'ADMIN' || msg.senderUsername === adminUsername}
                            isSystem={msg.isSystem}
                        >
                            <strong>{msg.senderNickname}</strong>
                            <div className="message-content">{msg.message}</div>
                            <MessageMeta>
                                {formatDateTime(msg.createdAt)}
                            </MessageMeta>
                        </MessageBubble>
                    ))
                )}
                <div ref={messagesEndRef} />
            </MessageContainer>

            <ChatForm onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <ChatInput
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isChatClosed ? "종료된 채팅방입니다." : "메시지를 입력하세요..."}
                    disabled={isChatClosed || !stompClientActive}
                />
                <SendButton type="submit" disabled={isChatClosed || !stompClientActive || newMessage.trim() === ''}>
                    전송
                </SendButton>
            </ChatForm>
        </ChatWrapper>
    );
}

export default AdminChatDetailCom;