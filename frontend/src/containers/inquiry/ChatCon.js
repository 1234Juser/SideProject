import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
    const [isChatClosed, setIsChatClosed] = useState(false);

    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // AI 어시스턴트 초기 메시지를 useMemo로 메모이제이션
    const welcomeMessage = useMemo(() => ({
        messageId: `system-${Date.now()}`,
        senderNickname: 'AI 어시스턴트',
        message: '안녕하세요. 궁금한 내용을 간단히 입력해 주시면 관리자가 답변을 드립니다!',
        createdAt: new Date().toISOString(),
        isSystem: true
    }), []); // 의존성 배열이 비어 있으므로, 컴포넌트 마운트 시 한 번만 생성됩니다.

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const connectAndSubscribe = useCallback((sessionId) => {
        if (stompClientRef.current?.active) {
            console.log("이미 연결되어 있습니다.");
            return;
        }

        const accessToken = auth.accessToken;
        if (!accessToken) {
            setError('인증 정보가 없어 채팅에 연결할 수 없습니다.');
            setIsLoading(false);
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws-chat?token=${accessToken}`),
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            debug: (str) => { console.log(new Date(), str); },
            reconnectDelay: 5000,
            onConnect: () => {
                // console.log('WebSocket 연결 성공!');
                setError(null);
                setIsChatClosed(false); // 연결 성공 시 채팅은 열린 상태

                client.subscribe(`/topic/chat/room/${sessionId}`, message => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, receivedMessage]);
                    // console.log("새 메시지 수신:", receivedMessage);
                });

                console.log(`구독 성공: /topic/chat/room/${sessionId}`);
            },
            onStompError: (frame) => {
                setError('채팅 서버 연결 오류: ' + frame.headers['message']);
                setIsChatClosed(true); // 오류 발생 시 채팅 종료 상태로 간주
            },
            onWebSocketClose: (event) => {
                // 웹소켓 연결이 닫히면 채팅 종료 상태로 설정 (사용자가 명시적으로 닫지 않은 경우)
                if (event.code !== 1000) { // 1000은 정상 종료 코드
                    setIsChatClosed(true);
                    setError('채팅 연결이 끊어졌습니다.');
                }
            }
        });

        client.activate();
        stompClientRef.current = client;
    }, [auth.accessToken]);


    const fetchSession = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsChatClosed(false); // 새로운 세션을 가져오기 전에 초기화

        try {
            const response = await axios.post('/chat/session', {}, {
                headers: { 'Authorization': `Bearer ${auth.accessToken}` }
            });
            const sessionData = response.data;
            setSession(sessionData);

            if (sessionData.status === 'CLOSED') {
                // 백엔드에서 세션이 이미 닫힌 상태로 반환된 경우
                setIsChatClosed(true);
                setMessages([welcomeMessage]); // AI 어시스턴트 메시지만 표시
                if (stompClientRef.current && stompClientRef.current.active) {
                    stompClientRef.current.deactivate(); // STOMP 연결 해제
                }
                // console.log('이미 종료된 채팅 세션입니다.');
            } else {
                // 세션이 열린 경우
                setMessages([welcomeMessage, ...(sessionData.messages || [])]);
                connectAndSubscribe(sessionData.sessionId);
            }
            setIsLoading(false);
        } catch (err) {
            // console.error("채팅 세션 로딩 실패:", err);
            if (err.response) {
                // console.error(">> 응답 상태:", err.response.status);
                // console.error(">> 응답 데이터:", err.response.data);
            } else if (err.request) {
                // console.error(">> 응답 없음:", err.request);
            } else {
                // console.error('>> 요청 설정 오류:', err.message);
            }
            setError('채팅방에 입장할 수 없습니다. 잠시 후 다시 시도해주세요.');
            setIsLoading(false);
            setIsChatClosed(true); // 오류 발생 시 채팅 종료 상태로 간주
        }
    }, [auth.accessToken, connectAndSubscribe, welcomeMessage]);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            alert('채팅을 시작하려면 로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        fetchSession();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [auth.isAuthenticated, navigate, fetchSession]);


    const handleSendMessage = () => {
        if (!stompClientRef.current || !stompClientRef.current.active || !session || !newMessage.trim() || isChatClosed) {
            // console.warn("메시지를 보낼 수 없습니다: 클라이언트 비활성, 세션 없음, 메시지 비어있음 또는 채팅 종료 상태.");
            return;
        }

        const chatMessage = {
            sessionId: session.sessionId,
            senderNickname: auth.username,
            message: newMessage.trim(),
        };

        try {
            stompClientRef.current.publish({
                destination: '/app/chat/sendMessage',
                body: JSON.stringify(chatMessage),
            });
            // console.log("메시지 전송:", chatMessage);
            setNewMessage('');
        } catch (e) {
            // console.error("메시지 전송 실패:", e);
            setError("메시지 전송에 실패했습니다.");
        }
    };

    // "문의 종료" 버튼 클릭 핸들러
    const handleCloseChat = async () => {
        if (!session || !session.sessionId) {
            setError('종료할 채팅 세션 정보가 없습니다.');
            return;
        }

        // ROLE_USER만 종료 가능하도록 프론트엔드에서 한 번 더 확인 (백엔드에서도 검증)
        // auth 객체에 memberRole 정보가 있다고 가정
        if (auth.memberRole !== "ROLE_USER") {
            setError('채팅을 종료할 권한이 없습니다.');
            return;
        }

        try {
            await axios.patch(`/chat/session/${session.sessionId}/close`, {}, {
                headers: { 'Authorization': `Bearer ${auth.accessToken}` }
            });

            // console.log(`채팅 세션 ${session.sessionId} 종료 성공.`);
            setIsChatClosed(true); // 채팅 종료 상태로 변경
            setMessages([]); // 기존 메시지 모두 초기화 (ChatCom에서 '종료되었습니다' 메시지 표시)
            setNewMessage(''); // 입력 필드 초기화
            setSession(null); // 세션 정보 초기화 (새로운 세션을 생성할 수 있도록)

            // STOMP 연결 해제
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }

        } catch (err) {
            // console.error("채팅 세션 종료 실패:", err);
            if (err.response) {
                setError(err.response.data?.message || '채팅 종료 중 오류가 발생했습니다.');
            } else {
                setError('네트워크 오류 또는 서버 응답 없음.');
            }
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
            stompClientActive={stompClientRef.current?.active && !isChatClosed}
            handleCloseChat={handleCloseChat}
            isChatClosed={isChatClosed}
        />
    );
}

export default ChatCon;