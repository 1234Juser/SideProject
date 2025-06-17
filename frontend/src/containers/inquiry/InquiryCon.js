import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';
import InquiryCom from '../../components/inquiry/InquiryCom';

function InquiryCon() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { auth } = useAuth();

    // 1. 로그인되지 않은 사용자는 즉시 로그인 페이지로 이동시킵니다.
    useEffect(() => {
        if (auth.isAuthenticated === false) { // auth.isAuthenticated가 false로 명확하게 확인될 때만 리디렉션합니다.
            alert('1:1 문의를 작성하려면 로그인이 필요합니다.');
            navigate('/login');
        }
    }, [auth.isAuthenticated, navigate]);

    // 2. 문의 등록 성공 후의 리다이렉션을 처리하는 useEffect
    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => {
                navigate('/');
            }, 2000);
        }
        // 컴포넌트가 언마운트되거나 success 상태가 바뀌면 타이머를 정리합니다.
        return () => clearTimeout(timer);
    }, [success, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!title.trim() || !content.trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }

        if (!auth.accessToken) {
            setError('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post('/inquiries',
                { title, content },
                {
                    headers: {
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                }
            );

            setSuccess('문의가 성공적으로 등록되었습니다. 잠시 후 홈으로 이동합니다.');
            setTitle('');
            setContent('');

        } catch (err) {
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('인증에 실패했습니다. 다시 로그인 해주세요.');
                } else {
                    setError(err.response.data?.message || '문의 등록 중 오류가 발생했습니다.');
                }
            } else if (err.request) {
                setError('서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.');
            } else {
                setError('요청을 보내는 중 문제가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 인증되지 않은 경우 폼이 잠깐 보이는 것을 방지하기 위해 null을 렌더링합니다.
    if (!auth.isAuthenticated) {
        return null;
    }

    // 폼 비활성화는 로딩 상태에만 의존합니다.
    const isFormDisabled = isLoading;

    return (
        <InquiryCom
            title={title}
            content={content}
            error={error}
            success={success}
            isLoading={isLoading}
            isFormDisabled={isFormDisabled}
            setTitle={setTitle}
            setContent={setContent}
            handleSubmit={handleSubmit}
        />
    );
}

export default InquiryCon;