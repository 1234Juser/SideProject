import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import PaymentService from '../../service/PaymentService';
import { getOrderDetails } from '../../service/OrderService';
import PaymentDetailCom from '../../components/payment/PaymentDetailCom';
import { PaymentDetailContainer, PaymentDetailHeader } from '../../style/payment/PaymentDetailStyle';

function PaymentDetailCon() {
    const { paymentId } = useParams();
    const navigate = useNavigate();
    const { auth, isAuthInitialized, logout } = useAuth();
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthInitialized) {
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

            if (!paymentId) {
                setError('결제 ID가 없습니다.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');

                // 1. 결제 상세 정보 조회
                const paymentResponse = await PaymentService.getPaymentDetails(paymentId, auth.accessToken);
                setPaymentDetails(paymentResponse);

                // 2. 결제에 연결된 주문 상세 정보 조회
                if (paymentResponse.orderId) {
                    const orderResponse = await getOrderDetails(paymentResponse.orderId, auth.accessToken);
                    setOrderDetails(orderResponse);
                } else {
                }

            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('인증이 만료되었습니다. 다시 로그인해주세요.');
                    logout();
                    navigate('/login');
                } else if (err.response && err.response.status === 404) {
                    setError('해당 결제 또는 주문 정보를 찾을 수 없습니다.');
                } else if (err.response && err.response.status === 403) {
                    setError('해당 정보에 접근할 권한이 없습니다.');
                }
                else {
                    setError('상세 정보를 불러오는 데 실패했습니다.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [paymentId, auth.isAuthenticated, auth.accessToken, isAuthInitialized, navigate, logout]);

    // 로딩 중일 때 표시할 UI
    if (loading) {
        return (
            <PaymentDetailContainer>
                <PaymentDetailHeader>결제 상세 정보를 불러오는 중입니다...</PaymentDetailHeader>
            </PaymentDetailContainer>
        );
    }

    return (
        <PaymentDetailCom
            paymentDetails={paymentDetails}
            orderDetails={orderDetails}
            error={error}
            navigate={navigate}
        />
    );
}

export default PaymentDetailCon;
