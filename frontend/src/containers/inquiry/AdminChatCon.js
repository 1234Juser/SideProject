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

    // 'OPEN'과 'CLOSED' 상태의 세션을 모두 가져오는 함수
    const fetchActiveSessions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            // API 엔드포인트를 /sessions/admin으로 변경
            const response = await axios.get('/chat/sessions/admin', {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setSessions(response.data);
        } catch (err) {
            console.error("활성 채팅 세션 목록 조회 실패:", err);
            setError('채팅 세션 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [auth.accessToken]);

    useEffect(() => {
        fetchActiveSessions();
    }, [fetchActiveSessions]);

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

    // 선택된 채팅방을 '보관(archive)' 처리하는 함수
    const onArchiveSelectedSessions = useCallback(async () => {
        if (selectedSessionIds.size === 0) {
            setSuccessMessage(null);
            setError('선택된 채팅방이 없습니다.');
            return;
        }

        if (!window.confirm(`선택된 ${selectedSessionIds.size}개의 채팅방을 보관(삭제)처리 하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            // API 엔드포인트를 /archive로 변경
            const archivePromises = Array.from(selectedSessionIds).map(sessionId =>
                axios.patch(`/chat/session/${sessionId}/archive`, {}, {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`
                    }
                })
            );
            await Promise.all(archivePromises);
            setSuccessMessage('선택된 채팅방이 성공적으로 보관(삭제)되었습니다.');
            setSelectedSessionIds(new Set()); // 선택된 항목 초기화
            fetchActiveSessions(); // 목록 새로고침
        } catch (err) {
            console.error("채팅방 보관 실패:", err);
            setError('채팅방 보관 처리에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedSessionIds, auth.accessToken, fetchActiveSessions]);

    return (
        <AdminChatCom
            sessions={sessions}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            selectedSessionIds={selectedSessionIds}
            onCheckboxChange={handleCheckboxChange}
            onArchiveSelectedSessions={onArchiveSelectedSessions} // props 이름 변경
        />
    );
}

export default AdminChatCon;