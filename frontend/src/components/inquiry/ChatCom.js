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
    StatusMessage
} from '../../style/inquiry/ChatStyle';

function ChatCom({ messages, newMessage, setNewMessage, handleSendMessage, isLoading, error, authMemberUsername, messagesEndRef, session, stompClientActive }) {
    if (isLoading) {
        return <ChatWrapper><StatusMessage>채팅방 로딩 중...</StatusMessage></ChatWrapper>;
    }

    if (error) {
        return <ChatWrapper><StatusMessage className="error">{error}</StatusMessage></ChatWrapper>;
    }

    return (
        <ChatWrapper>
            <ChatHeader>1:1 채팅 문의</ChatHeader>
            <MessageContainer>
                {messages.map((msg, index) => (
                    <MessageBubble key={msg.messageId || index} isUser={msg.senderNickname === authMemberUsername}>
                        {/* 이 부분을 수정하여 모든 메시지에 닉네임이 보이도록 합니다. */}
                        <MessageMeta isUser={msg.senderNickname === authMemberUsername} className="sender">{msg.senderNickname}</MessageMeta>
                        <div className="message-content">{msg.message}</div>
                        <MessageMeta isUser={msg.senderNickname === authMemberUsername} className="time">{new Date(msg.createdAt).toLocaleTimeString()}</MessageMeta>
                    </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
            </MessageContainer>
            <ChatForm onSubmit={handleSendMessage}>
                <ChatInput
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    disabled={!session || !stompClientActive}
                />
                <SendButton type="submit" disabled={!session || !stompClientActive || !newMessage.trim()}>
                    전송
                </SendButton>
            </ChatForm>
        </ChatWrapper>
    );
}

export default ChatCom;