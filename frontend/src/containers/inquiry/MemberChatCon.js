import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';
import MemberChatCom from "../../components/inquiry/MemberChatCom";

function MemberChatCon() {
    const navigate = useNavigate();
    const { auth } = useAuth(); // 인증(토큰) 정보를 가져옵니다.

    const [chatSessions, setChatSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchChatSessions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!auth.accessToken) {
                navigate('/login'); // 토큰이 없으면 로그인 페이지로 리다이렉트
                return;
            }

            const response = await axios.get('/chat/my-sessions', {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}` // 인증 토큰을 헤더에 포함합니다.
                }
            });
            setChatSessions(response.data);
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || '채팅 세션 목록을 불러오는데 실패했습니다.');
                if (err.response.status === 401 || err.response.status === 403) {
                    navigate('/login');
                }
            } else {
                setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
            }
            setChatSessions([]);
        } finally {
            setIsLoading(false);
        }
    }, [auth.accessToken, navigate]);

    useEffect(() => {
        fetchChatSessions();
    }, [fetchChatSessions]);

    // 채팅 세션 상세 페이지로 이동하는 핸들러
    const handleSessionClick = (sessionId) => {
        navigate(`/member/chat-inquiries/${sessionId}`);
    };

    return (
        <MemberChatCom
            chatSessions={chatSessions}
            isLoading={isLoading}
            error={error}
            onSessionClick={handleSessionClick} // 세션 클릭 핸들러를 컴포넌트에 전달
        />
    );
}

export default MemberChatCon;