import React from 'react';
import {
    ChatListContainer, Title, ChatTable, TableHeader, TableRow, TableCell,
    StatusBadge, Checkbox, ActionButtonsContainer, ActionButton, InfoText, Message
} from '../../style/inquiry/AdminChatStyle';
import { useNavigate } from 'react-router-dom';

function AdminChatCom({
                          sessions,
                          isLoading,
                          error,
                          successMessage,
                          selectedSessionIds,
                          onCheckboxChange,
                          onArchiveSelectedSessions
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

    const handleRowClick = (sessionId) => {
        navigate(`/admin/chat-inquiries/${sessionId}`);
    };

    return (
        <ChatListContainer>
            <Title>관리자 1:1 채팅 목록</Title>
            {successMessage && <Message className="success">{successMessage}</Message>}

            {sessions.length === 0 ? (
                <InfoText>현재 관리할 채팅 세션이 없습니다.</InfoText>
            ) : (
                <>
                    <ChatTable>
                        <thead>
                        <tr>
                            <TableHeader style={{ width: '5%' }}></TableHeader>
                            <TableHeader style={{ width: '10%' }}>세션 ID</TableHeader>
                            <TableHeader style={{ width: '30%' }}>사용자 닉네임</TableHeader>
                            <TableHeader style={{ width: '20%' }}>상태</TableHeader>
                            <TableHeader style={{ width: '35%' }}>생성일</TableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.map((session) => (
                            <TableRow key={session.sessionId} onClick={() => handleRowClick(session.sessionId)}>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        type="checkbox"
                                        checked={selectedSessionIds.has(session.sessionId)}
                                        onChange={() => onCheckboxChange(session.sessionId)}
                                        // 'CLOSED' 상태인 세션만 선택하여 보관(삭제)할 수 있도록 변경
                                        disabled={session.status !== 'CLOSED'}
                                        title={session.status !== 'CLOSED' ? '종료된 채팅방만 보관할 수 있습니다.' : ''}
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
                        {/* 버튼의 onClick과 텍스트 변경 */}
                        <ActionButton
                            onClick={onArchiveSelectedSessions}
                            disabled={selectedSessionIds.size === 0 || isLoading}
                        >
                            선택된 채팅방 보관(삭제)
                        </ActionButton>
                    </ActionButtonsContainer>
                </>
            )}
        </ChatListContainer>
    );
}

export default AdminChatCom;