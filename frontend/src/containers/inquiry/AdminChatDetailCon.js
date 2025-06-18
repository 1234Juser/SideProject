import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../../utils/AuthContext';
import AdminChatDetailCom from '../../components/inquiry/AdminChatDetailCom';

function AdminChatDetailCon() {
    const { auth } = useAuth();
    const { sessionId } = useParams(); // URL 파라미터에서 sessionId 가져오기

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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const connectAndSubscribe = useCallback((currentSessionId) => {
        if (stompClientRef.current?.active) {
            console.log("이미 WebSocket이 연결되어 있습니다.");
            return;
        }

        const accessToken = auth.accessToken;
        if (!accessToken) {
            console.error("Access token이 없어 WebSocket 연결을 할 수 없습니다.");
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
                console.log('WebSocket 연결 성공!');
                setError(null);
                setIsChatClosed(false);

                client.subscribe(`/topic/chat/room/${currentSessionId}`, message => {
                    const receivedMessage = JSON.parse(message.body);
                    console.log("새 메시지 수신:", receivedMessage);
                    // 메시지 중복 추가 방지 (메시지 ID가 없는 경우에만 추가)
                    setMessages(prevMessages => {
                        const exists = prevMessages.some(msg => msg.messageId === receivedMessage.messageId && receivedMessage.messageId != null);
                        return exists ? prevMessages : [...prevMessages, receivedMessage];
                    });
                });

                console.log(`구독 성공: /topic/chat/room/${currentSessionId}`);
            },
            onStompError: (frame) => {
                console.error('Broker Reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                setError('채팅 서버 연결 오류: ' + frame.headers['message']);
                setIsChatClosed(true);
            },
            onWebSocketClose: (event) => {
                console.log(`[Admin] Connection closed to http://localhost:8080/ws-chat`);
                console.log(`Close event code: ${event.code}, reason: ${event.reason}`);
                if (event.code !== 1000) {
                    setIsChatClosed(true);
                    setError('채팅 연결이 끊어졌습니다.');
                }
            }
        });

        client.activate();
        stompClientRef.current = client;
    }, [auth.accessToken]);


    const fetchSessionDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsChatClosed(false);

        if (!sessionId) {
            setError("채팅 세션 ID가 제공되지 않았습니다.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/chat/session/${sessionId}`, {
                headers: { 'Authorization': `Bearer ${auth.accessToken}` }
            });
            const sessionData = response.data;
            setSession(sessionData);
            setMessages(sessionData.messages || []); // 기존 메시지 설정

            if (sessionData.status === 'CLOSED') {
                setIsChatClosed(true);
                if (stompClientRef.current && stompClientRef.current.active) {
                    stompClientRef.current.deactivate();
                }
                console.log('이미 종료된 채팅 세션입니다.');
            } else {
                connectAndSubscribe(sessionData.sessionId); // 실시간 연결
            }
            setIsLoading(false);
        } catch (err) {
            console.error("채팅 세션 상세 로딩 실패:", err);
            if (err.response) {
                console.error(">> 응답 상태:", err.response.status);
                console.error(">> 응답 데이터:", err.response.data);
                setError(`세션 로딩 실패: ${err.response.data.message || err.response.statusText}`);
            } else {
                setError('세션 로딩 중 알 수 없는 오류가 발생했습니다.');
            }
            setIsLoading(false);
            setIsChatClosed(true); // 에러 발생 시 채팅 종료 상태로 간주
        }
    }, [sessionId, auth.accessToken, connectAndSubscribe]);

    useEffect(() => {
        fetchSessionDetails();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
                console.log("WebSocket 연결 해제됨.");
            }
        };
    }, [fetchSessionDetails]);

    const handleSendMessage = useCallback(() => {
        if (!stompClientRef.current || !stompClientRef.current.active) {
            setError('채팅 서버에 연결되어 있지 않습니다.');
            return;
        }
        if (!newMessage.trim()) {
            return; // 빈 메시지는 전송하지 않음
        }
        if (!session || !session.sessionId) {
            setError('채팅 세션 정보가 없습니다.');
            return;
        }

        const chatMessage = {
            sessionId: session.sessionId,
            message: newMessage.trim(),
        };

        try {
            stompClientRef.current.publish({
                destination: '/app/chat/sendMessage',
                body: JSON.stringify(chatMessage),
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setNewMessage('');
            setError(null);
        } catch (e) {
            console.error("메시지 전송 실패:", e);
            setError("메시지 전송에 실패했습니다.");
        }
    }, [newMessage, session, auth.accessToken]);


    const handleCloseChat = useCallback(async () => {
        if (!session || !session.sessionId) {
            setError('채팅 세션 정보가 없어 종료할 수 없습니다.');
            return;
        }

        if (!window.confirm('정말로 이 채팅 세션을 종료하시겠습니까?')) {
            return;
        }

        try {
            await axios.patch(`/chat/session/${session.sessionId}/close`, {}, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setIsChatClosed(true);
            setSession(prev => ({ ...prev, status: 'CLOSED' })); // UI 업데이트
            setError(null);
            alert('채팅 세션이 성공적으로 종료되었습니다.');
            if (stompClientRef.current && stompClientRef.current.active) {
                stompClientRef.current.deactivate();
            }
        } catch (err) {
            console.error("채팅 세션 종료 실패:", err);
            setError(`채팅 세션 종료 실패: ${err.response?.data?.message || err.message}`);
        }
    }, [session, auth.accessToken]);

    return (
        <AdminChatDetailCom
            session={session}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={error}
            authMemberUsername={auth.username} // 관리자 계정의 username 전달 (메시지 구분용)
            messagesEndRef={messagesEndRef}
            stompClientActive={stompClientRef.current?.active}
            handleCloseChat={handleCloseChat}
            isChatClosed={isChatClosed}
        />
    );
}

export default AdminChatDetailCon;