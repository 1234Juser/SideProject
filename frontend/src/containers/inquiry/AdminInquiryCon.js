import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import AdminInquiryCom from '../../components/inquiry/AdminInquiryCom';
import { InfoText } from '../../style/inquiry/AdminInquiryStyle';

function AdminInquiryCon() {
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const navigate = useNavigate();
    const { auth } = useAuth();

    const fetchInquiries = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);
        // console.log("fetchInquiries 호출됨. 현재 페이지:", page);
        // console.log("현재 auth.accessToken:", auth.accessToken ? "존재함" : "없음");

        try {
            const response = await axios.get(`/inquiries?page=${page}&size=5&sort=createdAt,desc`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });
            // console.log("API 응답 데이터:", response.data);
            setInquiries(response.data.content);
            setTotalPages(response.data.totalPages);
            // console.log("문의 목록 업데이트 완료:", response.data.content);
            // console.log("총 페이지 수 업데이트 완료:", response.data.totalPages);
        } catch (err) {
            // console.error("Failed to fetch inquiries:", err);
            if (err.response) {
                // console.error("API 응답 에러 상태 코드:", err.response.status);
                // console.error("API 응답 에러 데이터:", err.response.data);
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('인증 실패 또는 권한이 없습니다. 다시 로그인 해주세요.');
                    navigate('/login');
                } else {
                    setError(err.response.data?.message || '문의 목록을 불러오는데 실패했습니다.');
                }
            } else {
                setError('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
            }
        } finally {
            setIsLoading(false);
            // console.log("로딩 상태 종료 (isLoading = false)");
        }
    }, [auth.accessToken, navigate]);

    useEffect(() => {
        if (auth.accessToken) {
            fetchInquiries(currentPage);
            setIsAuthInitialized(true);
        } else {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            navigate('/login');
        }
    }, [auth.accessToken, currentPage, fetchInquiries, navigate]);

    // 문의 상세 페이지로 이동하는 함수
    const handleRowClick = (inquiryId) => {
        navigate(`/admin/inquiries/${inquiryId}`);
    };

    return (
        <>
            {isAuthInitialized ? (
                <AdminInquiryCom
                    inquiries={inquiries}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isLoading={isLoading}
                    error={error}
                    handlePageChange={setCurrentPage}
                    handleRowClick={handleRowClick} // handleRowClick prop 전달
                />
            ) : (
                <InfoText>인증 정보 로딩 중...</InfoText>
            )}
        </>
    );
}

export default AdminInquiryCon;