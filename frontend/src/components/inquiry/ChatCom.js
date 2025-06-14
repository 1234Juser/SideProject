import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../../utils/AuthContext';
import {
    ChatWrapper,
    MessageContainer,
    MessageBubble,
    MessageMeta,
    ChatForm,
    ChatInput,
    SendButton,
    StatusMessage
} from '../../style/inquiry/ChatStyle';

function ChatCom() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // 새 메시지가 추가될 때마다 메시지 목록의 가장 아래로 스크롤합니다.
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // 1. 로그인 상태 확인
        if (!auth.isAuthenticated) {
            alert('채팅을 시작하려면 로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        // 2. 채팅 세션 정보 가져오기
        const fetchSession = async () => {
            try {
                const response = await axios.post('/chat/session', {}, {
                    headers: { 'Authorization': `Bearer ${auth.accessToken}` }
                });
                const sessionData = response.data;
                setSession(sessionData);
                setMessages(sessionData.messages || []);
                setIsLoading(false);
                // 세션 정보를 받은 후 WebSocket 연결 시작
                connectAndSubscribe(sessionData.sessionId);
            } catch (err) {
                console.error("채팅 세션 로딩 실패:", err);
                setError('채팅방에 입장할 수 없습니다. 잠시 후 다시 시도해주세요.');
                setIsLoading(false);
            }
        };

        fetchSession();

        // 3. WebSocket 연결 및 구독 설정
        const connectAndSubscribe = (sessionId) => {
            if (stompClientRef.current?.active) {
                console.log("이미 연결되어 있습니다.");
                return;
            }

            // 백엔드의 WebSocketConfig에 설정된 엔드포인트(/ws-chat)로 연결
            const client = new Client({
                // webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'), // 절대 경로 대신 상대 경로 사용
                webSocketFactory: () => new SockJS('/ws-chat'),
                connectHeaders: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                debug: (str) => { console.log(new Date(), str); },
                reconnectDelay: 5000,
                onConnect: () => {
                    console.log('WebSocket 연결 성공!');
                    // ChatController에서 정의한 메시지 브로드캐스팅 경로를 구독
                    client.subscribe(`/topic/chat/room/${sessionId}`, (message) => {
                        const receivedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    });
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                    setError('메시지 서버에 연결할 수 없습니다.');
                },
            });

            client.activate();
            stompClientRef.current = client;
        };

        // 4. 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            if (stompClientRef.current?.active) {
                console.log('WebSocket 연결을 종료합니다.');
                stompClientRef.current.deactivate();
            }
        };
    }, [auth, navigate]);

    // 5. 메시지 전송 처리
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && stompClientRef.current?.active && session) {
            const chatMessage = {
                sessionId: session.sessionId,
                message: newMessage,
            };

            // ChatController의 @MessageMapping 경로로 메시지 발행
            stompClientRef.current.publish({
                destination: '/app/sendMessage',
                body: JSON.stringify(chatMessage),
            });
            setNewMessage('');
        } else {
            setError("메시지를 보낼 수 없습니다. 연결 상태를 확인해주세요.");
        }
    };

    if (isLoading) {
        return <StatusMessage>채팅방 정보를 불러오는 중입니다...</StatusMessage>;
    }

    if (error) {
        return <StatusMessage>{error}</StatusMessage>;
    }

    return (
        <ChatWrapper>
            <MessageContainer>
                {messages.map((msg) => (
                    <MessageBubble key={msg.messageId} isUser={msg.senderNickname === auth.memberNickname}>
                        <MessageMeta>
                            <strong>{msg.senderNickname}</strong> ({new Date(msg.createdAt).toLocaleTimeString()})
                        </MessageMeta>
                        <p>{msg.message}</p>
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
                />
                <SendButton type="submit">전송</SendButton>
            </ChatForm>
        </ChatWrapper>
    );
}

export default ChatCom;