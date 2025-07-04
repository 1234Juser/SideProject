import React, { useEffect, useState, useCallback } from 'react';
import AdminPaymentCom from '../../components/payment/AdminPaymentCom';
import PaymentService from '../../service/PaymentService';
import { useAuth } from '../../utils/AuthContext';
import { format } from 'date-fns';
import { fetchAllMenus } from '../../service/menuService';

function AdminPaymentCon() {
    const { auth, isAuthInitialized } = useAuth();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [allMenus, setAllMenus] = useState([]);
    const [paymentsByDate, setPaymentsByDate] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // [디버그 로그 추가] AuthContext 상태 확인
    useEffect(() => {
    }, [isAuthInitialized, auth.accessToken]);


    // 모든 메뉴 정보를 불러오는 함수
    const fetchAllMenusData = useCallback(async () => {
        if (!isAuthInitialized || !auth.accessToken) {
            return;
        }
        try {
            const menus = await fetchAllMenus(auth.accessToken);
            setAllMenus(menus);
        } catch (err) {
            setError('메뉴 정보를 불러오는 데 실패했습니다.');
        }
    }, [auth.accessToken, isAuthInitialized]);

    // 날짜별 결제 내역을 불러오는 함수
    const fetchPaymentsByDate = useCallback(async (date) => {
        if (!isAuthInitialized || !auth.accessToken) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const paymentsOnDate = await PaymentService.getAllPaymentsForAdmin(auth.accessToken, date);

            // 모든 메뉴를 기반으로 초기화
            const groupedPayments = allMenus.reduce((acc, menu) => {
                acc[menu.menuId] = {
                    productId: menu.menuId,
                    menuName: menu.menuName,
                    imageUrl: menu.menuImageUrl,
                    totalQuantity: 0,
                    totalAmount: 0,
                    payments: []
                };
                return acc;
            }, {});

            // 해당 날짜의 결제 내역을 상품별로 집계
            paymentsOnDate.forEach(payment => {
                if (payment.orderDetails && payment.orderDetails.orderItems) {
                    payment.orderDetails.orderItems.forEach(item => {
                        const productId = item.menuId;
                        // 해당 상품이 allMenus에 존재하고, 이미 groupedPayments에 초기화되어 있다면
                        if (groupedPayments[productId]) {
                            groupedPayments[productId].totalQuantity += item.quantity;
                            groupedPayments[productId].totalAmount += (parseFloat(item.priceAtPurchase) * item.quantity);
                            groupedPayments[productId].payments.push({
                                paymentId: payment.paymentId,
                                impUid: payment.impUid,
                                paymentAmount: payment.paymentAmount,
                                paymentStatus: payment.paymentStatus,
                                paymentMethod: payment.paymentMethod,
                                paidAt: payment.paidAt,
                                memberId: payment.memberId,
                                memberUsername: payment.memberUsername
                            });
                        }
                    });
                }
            });

            setPaymentsByDate(Object.values(groupedPayments));


        } catch (err) {
            setError('날짜별 결제 내역을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [auth.accessToken, isAuthInitialized, allMenus]);


    // 날짜 변경 핸들러
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        fetchPaymentsByDate(newDate);
    };

    // 컴포넌트 마운트 시 초기 데이터 로드 (모든 메뉴 및 초기 결제 내역)
    useEffect(() => {
        if (isAuthInitialized && auth.accessToken) {
            fetchAllMenusData();
        } else {
        }
    }, [isAuthInitialized, auth.accessToken, fetchAllMenusData]);

    useEffect(() => {
        if (isAuthInitialized && auth.accessToken && allMenus.length > 0) {
            fetchPaymentsByDate(selectedDate);
        } else {
        }
    }, [isAuthInitialized, auth.accessToken, selectedDate, fetchPaymentsByDate, allMenus.length]);


    return (
        <AdminPaymentCom
            selectedDate={selectedDate}
            paymentsByDate={paymentsByDate}
            loading={loading}
            error={error}
            handleDateChange={handleDateChange}

        />
    );
}

export default AdminPaymentCon;
