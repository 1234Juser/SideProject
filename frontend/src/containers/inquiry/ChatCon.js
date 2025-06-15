import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../../utils/AuthContext';
import ChatCom from '../../components/inquiry/ChatCom';

function ChatCon() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            alert('채팅을 시작하려면 로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const fetchSession = async () => {
            try {
                const response = await axios.post('/chat/session', {}, {
                    headers: { 'Authorization': `Bearer ${auth.accessToken}` }
                });
                const sessionData = response.data;
                setSession(sessionData);

                const welcomeMessage = {
                    messageId: `system-${Date.now()}`,
                    sessionId: sessionData.sessionId,
                    senderNickname: 'AI 어시스턴트',
                    message: '안녕하세요. 궁금한 내용을 간단히 입력해 주시면 관리자가 답변을 드립니다!',
                    createdAt: new Date().toISOString(),
                    isSystem: true
                };

                setMessages([welcomeMessage, ...(sessionData.messages || [])]);
                setIsLoading(false);
                connectAndSubscribe(sessionData.sessionId);
            } catch (err) {
                console.error("채팅 세션 로딩 실패:", err);
                if (err.response) {
                    console.error(">> 응답 상태:", err.response.status);
                    console.error(">> 응답 데이터:", err.response.data);
                } else if (err.request) {
                    console.error(">> 응답 없음:", err.request);
                } else {
                    console.error('>> 요청 설정 오류:', err.message);
                }
                setError('채팅방에 입장할 수 없습니다. 잠시 후 다시 시도해주세요.');
                setIsLoading(false);
            }
        };

        fetchSession();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                console.log('STOMP client deactivated on component unmount.');
            }
        };
    }, [auth.isAuthenticated, auth.accessToken, navigate]);

    const connectAndSubscribe = (sessionId) => {
        if (stompClientRef.current?.active) {
            console.log("이미 연결되어 있습니다.");
            return;
        }

        const accessToken = auth.accessToken;
        if (!accessToken) {
            console.error("Access token is not available for WebSocket connection.");
            setError('인증 정보가 없어 채팅에 연결할 수 없습니다.');
            setIsLoading(false);
            return;
        }

        const client = new Client({
            // SockJS URL에 JWT 토큰을 쿼리 파라미터로 포함
            // 이 토큰은 초기 SockJS HTTP Handshake 요청 (예: /info) 및 실제 WebSocket 연결에 사용될 수 있음
            // 보안을 위해 URL에 토큰을 포함하는 것은 주의가 필요함. HTTPS 사용 필수.
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws-chat?token=${accessToken}`),
            connectHeaders: {
                // STOMP CONNECT 프레임에도 Authorization 헤더를 포함 (백엔드 ChannelInterceptor에서 사용 가능)
                Authorization: `Bearer ${accessToken}`,
            },
            debug: (str) => { console.log(new Date(), str); },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket 연결 성공!');
                setError(null);

                client.subscribe(`/topic/chat/room/${sessionId}`, message => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, receivedMessage]);
                    console.log("새 메시지 수신:", receivedMessage);
                });

                console.log(`구독 성공: /topic/chat/room/${sessionId}`);
            },
            onStompError: (frame) => {
                console.error('Broker Reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                setError('채팅 서버 연결 오류: ' + frame.headers['message']);
            },
            onWebSocketClose: (event) => {
                console.log(new Date(), `'Connection closed to http://localhost:8080/ws-chat'`);
                console.log(`Close event code: ${event.code}, reason: ${event.reason}`);
            }
        });

        client.activate();
        stompClientRef.current = client;
    };

    const handleSendMessage = () => {
        if (!stompClientRef.current || !stompClientRef.current.active || !session || !newMessage.trim()) {
            console.warn("메시지를 보낼 수 없습니다: 클라이언트 비활성, 세션 없음 또는 메시지 비어있음.");
            return;
        }

        const chatMessage = {
            sessionId: session.sessionId,
            senderNickname: auth.username, // 현재 로그인한 사용자 닉네임
            message: newMessage.trim(),
            // 추가 필드 (예: 메시지 타입 등)
        };

        // /app/chat/sendMessage 경로로 메시지 전송
        try {
            stompClientRef.current.publish({
                destination: '/app/chat/sendMessage',
                body: JSON.stringify(chatMessage),
            });
            console.log("메시지 전송:", chatMessage);
            setNewMessage(''); // 메시지 전송 후 입력 필드 초기화
        } catch (e) {
            console.error("메시지 전송 실패:", e);
            setError("메시지 전송에 실패했습니다.");
        }
    };

    return (
        <ChatCom
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={error}
            authMemberUsername={auth.username}
            messagesEndRef={messagesEndRef}
            session={session}
            stompClientActive={stompClientRef.current?.active}
        />
    );
}

export default ChatCon;