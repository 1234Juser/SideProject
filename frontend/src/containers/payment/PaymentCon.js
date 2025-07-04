import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import PaymentService from '../../service/PaymentService';
import PaymentCom from '../../components/payment/PaymentCom';

function PaymentCon() {
    const { auth, isAuthInitialized, logout } = useAuth();
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPaymentIds, setSelectedPaymentIds] = useState(new Set());


    const fetchPaymentHistory = async () => {
        if (!isAuthInitialized) {
            console.log('PaymentCon: AuthContext 초기화 대기 중...');
            return;
        }

        if (!auth.isAuthenticated) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!auth.accessToken) {
            setError('인증 토큰이 없습니다. 다시 로그인 해주세요.');
            logout();
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError('');
            // console.log('PaymentCon: 회원 결제 내역 조회 시도...');
            const response = await PaymentService.getPaymentsByMember(auth.accessToken);
            setPayments(response);
            // console.log('PaymentCon: 회원 결제 내역 조회 성공:', response);
            setSelectedPaymentIds(new Set()); // 결제 내역 새로고침 시 선택된 항목 초기화
        } catch (err) {
            // console.error('PaymentCon: 회원 결제 내역 조회 실패:', err);
            if (err.response && err.response.status === 401) {
                setError('인증이 만료되었습니다. 다시 로그인해주세요.');
                logout();
                navigate('/login');
            } else {
                setError('결제 내역을 불러오는 데 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 결제 내역 불러오기 (PaymentCom에서 그대로 가져옴)
    useEffect(() => {
        fetchPaymentHistory();
    }, [auth.isAuthenticated, auth.accessToken, isAuthInitialized, navigate, logout]);

    // 체크박스 변경 핸들러 (PaymentCom에서 그대로 가져옴)
    const handleCheckboxChange = (paymentId) => {
        setSelectedPaymentIds(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(paymentId)) {
                newSelected.delete(paymentId);
            } else {
                newSelected.add(paymentId);
            }
            return newSelected;
        });
    };

    // 선택된 결제 취소 핸들러 (PaymentCom에서 그대로 가져옴)
    const handleCancelSelectedPayments = async () => {
        if (selectedPaymentIds.size === 0) {
            alert('취소할 결제를 선택해주세요.');
            return;
        }

        if (!window.confirm(`${selectedPaymentIds.size}개의 결제를 정말 취소하시겠습니까?`)) {
            return;
        }

        setLoading(true);
        setError('');
        let successCount = 0;
        let failCount = 0;
        const failedPayments = [];

        for (const paymentId of selectedPaymentIds) {
            try {
                await PaymentService.cancelPayment(paymentId, { reason: "고객 요청으로 인한 취소" }, auth.accessToken);
                successCount++;
            } catch (err) {
                // console.error(`결제 취소 실패 (ID: ${paymentId}):`, err);
                failCount++;
                failedPayments.push(paymentId);
            }
        }

        if (successCount > 0) {
            alert(`${successCount}개의 결제가 성공적으로 취소되었습니다.`);
        }
        if (failCount > 0) {
            setError(`다음 결제 취소에 실패했습니다: ${failedPayments.join(', ')}. 콘솔을 확인해주세요.`);
        }

        await fetchPaymentHistory();
        setLoading(false);
    };

    const handlePaymentItemClick = (paymentId) => {
        navigate(`/mypage/payments/${paymentId}`);
    };

    return (
        <PaymentCom
            payments={payments}
            error={error}
            selectedPaymentIds={selectedPaymentIds}
            handleCheckboxChange={handleCheckboxChange}
            handleCancelSelectedPayments={handleCancelSelectedPayments}
            handlePaymentItemClick={handlePaymentItemClick}
            loading={loading}
        />
    );
}

export default PaymentCon;
