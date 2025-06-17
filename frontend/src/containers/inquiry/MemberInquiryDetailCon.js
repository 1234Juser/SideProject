import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';
import MemberInquiryDetailCom from "../../components/inquiry/MemberInquiryDetailCom";

function MemberInquiryDetailCon(){
    const { inquiryId } = useParams(); // URL에서 inquiryId 추출
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [inquiry, setInquiry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInquiryDetail = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!auth.accessToken) {
                // 토큰이 없으면 로그인 페이지로 리다이렉트
                navigate('/login');
                return;
            }

            const response = await axios.get(`/inquiries/${inquiryId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });
            setInquiry(response.data);
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || '문의 상세 정보를 불러오는데 실패했습니다.');
                if (err.response.status === 401 || err.response.status === 403) {
                    navigate('/login'); // 권한 없음 또는 인증 실패 시 로그인 페이지로 이동
                }
            } else {
                setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [auth.accessToken, inquiryId, navigate]);

    useEffect(() => {
        if (inquiryId) {
            fetchInquiryDetail();
        }
    }, [inquiryId, fetchInquiryDetail]);

    return(
        <>
            <MemberInquiryDetailCom
                inquiry={inquiry}
                isLoading={isLoading}
                error={error}
            />
        </>
    )
}
export default MemberInquiryDetailCon