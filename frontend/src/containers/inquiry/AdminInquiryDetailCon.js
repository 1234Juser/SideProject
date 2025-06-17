import React, { useEffect, useState, useCallback } from 'react'; // useCallback import 추가
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';
import AdminInquiryDetailCom from '../../components/inquiry/AdminInquiryDetailCom'; // 경로 확인

function AdminInquiryDetailCon() {
    const { inquiryId } = useParams(); // URL에서 inquiryId 추출
    const navigate = useNavigate();
    const { auth } = useAuth(); // 인증 정보 가져오기 (memberUsername 포함)

    const [inquiry, setInquiry] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // 문의 상세 정보 불러오기 - useCallback으로 래핑
    const fetchInquiryDetail = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null); // 새로운 fetch 시 success 메시지 초기화
        try {
            const response = await axios.get(`/inquiries/${inquiryId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });
            setInquiry(response.data);
            // 기존 답변이 있다면 불러와서 replyContent 상태에 설정
            if (response.data.reply) {
                setReplyContent(response.data.reply.content);
            } else {
                setReplyContent(''); // 답변이 없으면 입력 필드를 비웁니다.
            }
        } catch (err) {
            console.error("Failed to fetch inquiry detail:", err);
            if (err.response) {
                setError(err.response.data?.message || '문의 상세 정보를 불러오는데 실패했습니다.');
                if (err.response.status === 403) {
                    navigate('/admin/inquiries'); // 권한 없는 경우 목록으로 리다이렉트
                }
            } else {
                setError('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [auth.accessToken, inquiryId, navigate]); // useCallback 의존성 추가

    useEffect(() => {
        if (auth.accessToken && inquiryId) {
            fetchInquiryDetail();
        } else if (!auth.accessToken) {
            navigate('/login'); // 인증 정보 없으면 로그인 페이지로
        }
    }, [auth.accessToken, inquiryId, navigate, fetchInquiryDetail]); // fetchInquiryDetail 의존성 추가

    // 답변 제출/수정 핸들러
    const handleSubmitReply = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!replyContent.trim()) {
            setError('답변 내용을 입력해주세요.');
            return;
        }

        try {
            // 'response' 변수가 사용되지 않으므로 제거
            await axios.post(`/inquiries/${inquiryId}/reply`, { content: replyContent }, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });
            setSuccess('답변이 성공적으로 등록/수정되었습니다.');
            await fetchInquiryDetail(); // 최신 상태를 다시 불러와 UI 업데이트 (답변 내용도 최신화됩니다)
        } catch (err) {
            console.error("Failed to submit reply:", err);
            if (err.response) {
                if (err.response.status === 403) {
                    setError('답변을 작성/수정할 권한이 없거나, 다른 관리자가 작성한 답변입니다.');
                } else if (err.response.status === 400 || err.response.status === 409) { // 409 Conflict for IllegalStateException
                    setError(err.response.data?.message || '답변 처리 중 오류가 발생했습니다.');
                } else {
                    setError(err.response.data?.message || '답변 등록/수정에 실패했습니다.');
                }
            } else {
                setError('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
            }
        }
    };

    // 답변 삭제 핸들러
    const handleDeleteReply = async () => {
        setError(null);
        setSuccess(null);
        if (!window.confirm('정말로 답변을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await axios.delete(`/inquiries/${inquiryId}/reply`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });
            setSuccess('답변이 성공적으로 삭제되었습니다.');
            setReplyContent(''); // 답변 내용 초기화
            await fetchInquiryDetail(); // 최신 상태를 다시 불러와 UI 업데이트 (답변이 없어지고, 문의 상태가 PENDING으로 변경됨)
        } catch (err) {
            console.error("Failed to delete reply:", err);
            if (err.response) {
                if (err.response.status === 403) {
                    setError('답변을 삭제할 권한이 없거나, 다른 관리자가 작성한 답변입니다.');
                } else if (err.response.status === 400 || err.response.status === 409) {
                    setError(err.response.data?.message || '답변 삭제 중 오류가 발생했습니다.');
                } else {
                    setError(err.response.data?.message || '답변 삭제에 실패했습니다.');
                }
            } else {
                setError('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
            }
        }
    };

    return (
        <AdminInquiryDetailCom
            inquiry={inquiry}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            handleSubmitReply={handleSubmitReply}
            handleDeleteReply={handleDeleteReply} // 새로운 prop 전달
            isLoading={isLoading}
            error={error}
            success={success}
            loggedInAdminUsername={auth.memberUsername} // 현재 로그인한 관리자 ID 전달
        />
    );
}

export default AdminInquiryDetailCon;