import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminChatCom from '../../components/inquiry/AdminChatCom';
import { useAuth } from '../../utils/AuthContext';

function AdminChatCon() {
    const { auth } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedSessionIds, setSelectedSessionIds] = useState(new Set());

    const fetchOpenSessions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.get('/chat/sessions/open', {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setSessions(response.data);
        } catch (err) {
            console.error("채팅 세션 목록 조회 실패:", err);
            setError('채팅 세션 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [auth.accessToken]);

    useEffect(() => {
        fetchOpenSessions();
    }, [fetchOpenSessions]);

    const handleCheckboxChange = useCallback((sessionId) => {
        setSelectedSessionIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sessionId)) {
                newSet.delete(sessionId);
            } else {
                newSet.add(sessionId);
            }
            return newSet;
        });
    }, []);

    const onCloseSelectedSessions = useCallback(async () => {
        if (selectedSessionIds.size === 0) {
            setSuccessMessage(null);
            setError('선택된 채팅방이 없습니다.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const closePromises = Array.from(selectedSessionIds).map(sessionId =>
                axios.patch(`/chat/session/${sessionId}/close`, {}, { // 빈 객체 전달 또는 요청 본문이 필요 없는 경우 생략
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`
                    }
                })
            );
            await Promise.all(closePromises);
            setSuccessMessage('선택된 채팅방이 성공적으로 종료되었습니다.');
            setSelectedSessionIds(new Set()); // 선택된 항목 초기화
            fetchOpenSessions(); // 목록 새로고침
        } catch (err) {
            console.error("채팅방 종료 실패:", err);
            setError('채팅방 종료에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedSessionIds, auth.accessToken, fetchOpenSessions]);

    return (
        <AdminChatCom
            sessions={sessions}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            selectedSessionIds={selectedSessionIds}
            onCheckboxChange={handleCheckboxChange}
            onCloseSelectedSessions={onCloseSelectedSessions}
        />
    );
}

export default AdminChatCon;