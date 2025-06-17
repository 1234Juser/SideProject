import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';
import AdminInquiryDetailCom from '../../components/inquiry/AdminInquiryDetailCom'; // 경로 확인

function AdminInquiryDetailCon() {
    const { inquiryId } = useParams(); // URL에서 inquiryId 추출
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [inquiry, setInquiry] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // 문의 상세 정보 불러오기
    useEffect(() => {
        const fetchInquiryDetail = async () => {
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
                // 기존 답변이 있으면 폼에 채워넣기
                if (response.data.reply) {
                    setReplyContent(response.data.reply.content);
                } else {
                    setReplyContent(''); // 답변이 없으면 빈 값으로 초기화
                }
            } catch (err) {
                console.error("문의 상세 정보 불러오기 실패:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError('인증 정보가 만료되었거나 권한이 없어서 문의 상세 정보를 볼 수 없습니다.');
                    navigate('/login'); // 권한 문제 시 로그인 페이지로 리다이렉트
                } else if (err.response && err.response.status === 404) {
                    setError('해당 문의를 찾을 수 없습니다.');
                } else {
                    setError('문의 상세 정보를 불러오는 중 오류가 발생했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (auth.accessToken && inquiryId) {
            fetchInquiryDetail();
        }
    }, [inquiryId, auth.accessToken, navigate]);

    // 답변 제출 핸들러
    const handleSubmitReply = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!replyContent.trim()) {
            setError('답변 내용을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`/inquiries/${inquiryId}/reply`,
                { content: replyContent },
                {
                    headers: {
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                }
            );
            setInquiry(prevInquiry => ({
                ...prevInquiry,
                reply: response.data,
                status: response.data.inquiryStatus // 답변이 달리면 문의 상태가 ANSWERED로 변경될 것이므로 업데이트
            }));
            setSuccess('답변이 성공적으로 등록되었습니다.');
        } catch (err) {
            console.error("답변 제출 실패:", err);
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('인증 정보가 만료되었거나 답변 권한이 없습니다.');
                    navigate('/login');
                } else {
                    setError(err.response.data?.message || '답변 등록 중 오류가 발생했습니다.');
                }
            } else {
                setError('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminInquiryDetailCom
            inquiry={inquiry}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            handleSubmitReply={handleSubmitReply}
            isLoading={isLoading}
            error={error}
            success={success}
        />
    );
}

export default AdminInquiryDetailCon;