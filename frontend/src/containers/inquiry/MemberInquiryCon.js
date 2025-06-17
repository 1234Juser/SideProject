import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import MemberInquiryCom from '../../components/inquiry/MemberInquiryCom';


function MemberInquiryCon() {
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // 0-indexed page
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInquiryIds, setSelectedInquiryIds] = useState(new Set()); // 선택된 문의 ID들을 저장하는 Set

    const navigate = useNavigate();
    const { auth } = useAuth();

    const fetchInquiries = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null); // 새로운 fetch 시 메시지 초기화
        console.log("fetchInquiries 호출됨. 현재 페이지:", page);

        if (!auth.accessToken) {
            setError('인증 정보가 없습니다. 로그인 해주세요.');
            setIsLoading(false);
            // navigate('/login'); // 인증 토큰이 없을 경우 로그인 페이지로 리디렉션
            return;
        }

        try {
            const response = await axios.get(`/inquiries?page=${page}&size=5&sort=createdAt,desc`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });
            setInquiries(response.data.content);
            setTotalPages(response.data.totalPages);
            setSelectedInquiryIds(new Set()); // 페이지 변경 또는 새로고침 시 선택 초기화
        } catch (err) {
            console.error("Failed to fetch inquiries:", err);
            if (err.response) {
                setError(`문의 목록 불러오기 실패: ${err.response.data.message || err.message}`);
                if (err.response.status === 401 || err.response.status === 403) {
                    navigate('/login'); // 권한 없음 또는 인증 실패 시 로그인 페이지로 이동
                }
            } else {
                setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [auth.accessToken, navigate]); // 의존성 배열에 auth.accessToken과 navigate 추가

    useEffect(() => {
        fetchInquiries(currentPage);
    }, [currentPage, fetchInquiries]); // currentPage나 fetchInquiries가 변경될 때마다 데이터를 가져옴

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCheckboxChange = (inquiryId) => {
        setSelectedInquiryIds(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(inquiryId)) {
                newSelected.delete(inquiryId);
            } else {
                newSelected.add(inquiryId);
            }
            return newSelected;
        });
    };

    const handleCloseInquiries = async () => {
        if (selectedInquiryIds.size === 0) {
            alert('종료할 문의를 선택해주세요.');
            return;
        }

        if (!window.confirm(`${selectedInquiryIds.size}개의 문의를 종료하시겠습니까?`)) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Set 객체를 배열로 변환하여 전송
            await axios.post('/inquiries/close', Array.from(selectedInquiryIds), {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`,
                    'Content-Type': 'application/json' // JSON 데이터를 보낸다고 명시
                }
            });
            setSuccessMessage('선택된 문의가 성공적으로 종료되었습니다.');
            setSelectedInquiryIds(new Set()); // 선택 초기화
            fetchInquiries(currentPage); // 목록 새로고침
        } catch (err) {
            console.error("Failed to close inquiries:", err);
            if (err.response) {
                setError(`문의 종료 실패: ${err.response.data.message || err.message}`);
            } else {
                setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MemberInquiryCom
            inquiries={inquiries}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            selectedInquiryIds={selectedInquiryIds}
            onPageChange={handlePageChange}
            onCheckboxChange={handleCheckboxChange}
            onCloseInquiries={handleCloseInquiries}
        />
    );
}

export default MemberInquiryCon;
