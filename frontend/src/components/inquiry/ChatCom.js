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

function ChatCom({
                     messages,
                     newMessage,
                     setNewMessage,
                     handleSendMessage,
                     isLoading,
                     error,
                     authMemberUsername,
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
        return <ChatWrapper><StatusMessage className="error">{error}</StatusMessage></ChatWrapper>;
    }

    // Shift + Enter 처리 함수
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 기본 Enter 동작(줄 바꿈) 방지
            handleSendMessage(); // 메시지 전송
        }

    };

    // 날짜 및 시간 포맷 함수 (오전/오후 포함)
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0시는 12시로 표시
        const formattedHours = hours.toString().padStart(2, '0');

        return `${year}-${month}-${day} ${ampm} ${formattedHours}:${minutes}`;
    };

    const closedChatMessages = isChatClosed ? [{
        messageId: 'system-closed',
        senderNickname: '시스템',
        message: '1:1문의 채팅방이 종료되었습니다.',
        createdAt: new Date().toISOString(),
        isSystem: true
    }] : messages;

    return (
        <ChatWrapper>
            <ChatHeader>
                1:1 채팅 문의
                {session && session.status !== 'CLOSED' && (
                    <EndChatButton onClick={handleCloseChat} disabled={!session}>
                        문의 종료
                    </EndChatButton>
                )}
            </ChatHeader>
            <MessageContainer>
                {closedChatMessages.map((msg, index) => (
                    <MessageBubble key={msg.messageId || index} isUser={msg.senderNickname === authMemberUsername}>
                        <MessageMeta isUser={msg.senderNickname === authMemberUsername} className="sender">{msg.senderNickname}</MessageMeta>
                        <div className="message-content">{msg.message}</div>
                        <MessageMeta isUser={msg.senderNickname === authMemberUsername} className="time">{formatDateTime(msg.createdAt)}</MessageMeta>
                    </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
            </MessageContainer>
            <ChatForm onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <ChatInput
                    // type="text" 속성은 textarea에 필요하지 않으므로 제거합니다.
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isChatClosed ? "종료된 채팅방입니다." : "메시지를 입력하세요...(Shift + Enter엔터로 줄바꿈) "}
                    disabled={!session || !stompClientActive || isChatClosed}
                />
                <SendButton
                    type="submit"
                    disabled={!session || !stompClientActive || !newMessage.trim() || isChatClosed}
                >
                    전송
                </SendButton>
            </ChatForm>
        </ChatWrapper>
    );
}

export default ChatCom;