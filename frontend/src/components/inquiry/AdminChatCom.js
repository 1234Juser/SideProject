import React from 'react';
import {
    ChatListContainer, Title, ChatTable, TableHeader, TableRow, TableCell,
    StatusBadge, Checkbox, ActionButtonsContainer, CloseButton, InfoText, Message
} from '../../style/inquiry/AdminChatStyle';
import { useNavigate } from 'react-router-dom';

function AdminChatCom({
                          sessions,
                          isLoading,
                          error,
                          successMessage,
                          selectedSessionIds,
                          onCheckboxChange,
                          onCloseSelectedSessions
                      }) {
    const navigate = useNavigate();

    if (isLoading) {
        return <InfoText>채팅 목록을 불러오는 중...</InfoText>;
    }

    if (error) {
        return <Message className="error">오류: {error}</Message>;
    }

    if (!Array.isArray(sessions)) {
        console.error("채팅 세션 데이터가 올바른 배열 형식이 아닙니다:", sessions);
        return <Message className="error">채팅 데이터를 불러오는데 문제가 발생했습니다.</Message>;
    }

    // 채팅 상세 페이지로 이동하는 핸들러 (세션 ID를 파라미터로 전달)
    const handleRowClick = (sessionId) => {
        navigate(`/admin/chat-inquiries/${sessionId}`);
    };

    return (
        <ChatListContainer>
            <Title>관리자 1:1 채팅 목록</Title>
            {successMessage && <Message className="success">{successMessage}</Message>}

            {sessions.length === 0 ? (
                <InfoText>현재 열려있는 채팅 세션이 없습니다.</InfoText>
            ) : (
                <>
                    <ChatTable>
                        <thead>
                        <tr>
                            <TableHeader style={{ width: '5%' }}></TableHeader><TableHeader style={{ width: '10%' }}>세션 ID</TableHeader><TableHeader style={{ width: '30%' }}>사용자 닉네임</TableHeader><TableHeader style={{ width: '20%' }}>상태</TableHeader><TableHeader style={{ width: '35%' }}>생성일</TableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.map((session) => (
                            <TableRow key={session.sessionId} onClick={() => handleRowClick(session.sessionId)}>
                                <TableCell onClick={(e) => e.stopPropagation()}> {/* 체크박스 클릭 시 행 클릭 이벤트 방지 */}
                                    <Checkbox
                                        type="checkbox"
                                        checked={selectedSessionIds.has(session.sessionId)}
                                        onChange={() => onCheckboxChange(session.sessionId)}
                                        disabled={session.status === 'CLOSED'} // 이미 닫힌 세션은 선택 불가
                                    />
                                </TableCell>
                                <TableCell>{session.sessionId}</TableCell>
                                <TableCell>{session.memberNickname}</TableCell>
                                <TableCell>
                                    <StatusBadge $status={session.status}>{session.status}</StatusBadge>
                                </TableCell>
                                <TableCell>
                                    {new Date(session.createdAt).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                        </tbody>
                    </ChatTable>

                    <ActionButtonsContainer>
                        <CloseButton
                            onClick={onCloseSelectedSessions}
                            disabled={selectedSessionIds.size === 0 || isLoading}
                        >
                            선택된 채팅방 종료
                        </CloseButton>
                    </ActionButtonsContainer>
                </>
            )}
        </ChatListContainer>
    );
}

export default AdminChatCom;