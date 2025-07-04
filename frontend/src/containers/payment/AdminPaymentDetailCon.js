import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import PaymentService from '../../service/PaymentService';
import AdminPaymentDetailCom from '../../components/payment/AdminPaymentDetailCom';

function AdminPaymentDetailCon() {
    const { productId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, isAuthInitialized } = useAuth();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [userPaymentsForProduct, setUserPaymentsForProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // 이전 페이지에서 전달받은 상품 정보 및 날짜 설정
    useEffect(() => {
        if (location.state && location.state.selectedProduct) {
            setSelectedProduct(location.state.selectedProduct);
            setUserPaymentsForProduct(location.state.selectedProduct.payments || []);
        }
        if (location.state && location.state.selectedDate) {
            setSelectedDate(location.state.selectedDate);
        }
        setLoading(false); // 초기 로딩 완료
    }, [location.state]);

    // 이 페이지에 직접 접근했을 경우 (location.state가 없는 경우)
    // 또는 특정 날짜의 모든 결제 내역을 다시 불러와서 해당 상품의 결제 내역을 찾아야 하는 경우
    const fetchProductPayments = useCallback(async () => {
        if (!isAuthInitialized || !auth.accessToken || !productId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const paymentsOnDate = await PaymentService.getAllPaymentsForAdmin(auth.accessToken, selectedDate);

            // 해당 productId를 가진 상품의 결제 내역을 찾습니다.
            const foundProduct = paymentsOnDate.find(p => p.productId === parseInt(productId));

            if (foundProduct) {
                setSelectedProduct(foundProduct);
                setUserPaymentsForProduct(foundProduct.payments || []);
            } else {
                setError('해당 상품의 결제 내역을 찾을 수 없습니다.');
                setSelectedProduct(null);
                setUserPaymentsForProduct([]);
            }
        } catch (err) {
            setError('상품별 결제 내역을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [productId, auth.accessToken, isAuthInitialized, selectedDate]);


    // 컴포넌트 마운트 시 또는 인증/날짜/상품 ID 변경 시 데이터 로드
    useEffect(() => {
        // location.state에서 데이터가 없는 경우에만 API 호출
        if (!location.state || !location.state.selectedProduct) {
            fetchProductPayments();
        }
    }, [location.state, fetchProductPayments]);

    // 목록으로 돌아가기 버튼 클릭 핸들러
    const handleBackClick = () => {
        navigate('/adminmypage/payment');
    };

    return (
        <AdminPaymentDetailCom
            selectedProduct={selectedProduct}
            userPaymentsForProduct={userPaymentsForProduct}
            loading={loading}
            error={error}
            handleBackClick={handleBackClick}
        />
    );
}

export default AdminPaymentDetailCon;
