import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';
import MemberChatDetailCom from "../../components/inquiry/MemberChatDetailCom";

function MemberChatDetailCon() {
    const { sessionId } = useParams(); // URL에서 sessionId를 가져옵니다.
    const navigate = useNavigate();
    const { auth } = useAuth(); // 인증(토큰) 정보 및 사용자 ID를 가져옵니다.

    const [chatSession, setChatSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchChatSessionDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!auth.accessToken) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`/chat/my-session/${sessionId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });
            setChatSession(response.data);
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || '채팅 상세 정보를 불러오는데 실패했습니다.');
                if (err.response.status === 401 || err.response.status === 403) {
                    navigate('/login');
                } else if (err.response.status === 404) {
                    setError('해당 채팅 세션을 찾을 수 없습니다.');
                }
            } else {
                setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
            }
            setChatSession(null);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, auth.accessToken, navigate]);

    useEffect(() => {
        if (sessionId) {
            fetchChatSessionDetails();
        }
    }, [sessionId, fetchChatSessionDetails]);

    const handleBackClick = () => {
        navigate('/member/chat-inquiries'); // 목록 페이지로 돌아가기
    };

    return (
        <MemberChatDetailCom
            chatSession={chatSession}
            isLoading={isLoading}
            error={error}
            onBackClick={handleBackClick}
            currentMemberId={auth.memberId} // 현재 로그인한 사용자의 ID 전달
        />
    );
}

export default MemberChatDetailCon;