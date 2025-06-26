import CartCom from "../../components/cart/CartCom";
import { fetchCartItems } from '../../service/CartService';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../utils/AuthContext';
import { useState } from 'react';

function CartCon(){
    const { auth } = useAuth(); // 인증 정보 가져오기
    const [selectedCartItems, setSelectedCartItems] = useState([]); // 선택된 장바구니 항목 상태

    const { data: cartItems, isLoading, isError, error } = useQuery({
        queryKey: ['cartItems', auth.accessToken], // 쿼리 키에 accessToken 포함
        queryFn: () => {
            if (!auth.isAuthenticated || !auth.accessToken) {
                // 인증되지 않은 경우 빈 배열 반환 또는 에러 처리
                throw new Error('로그인이 필요합니다.');
            }
            return fetchCartItems(auth.accessToken);
        },
        enabled: auth.isAuthenticated && !!auth.accessToken, // 인증된 경우에만 쿼리 실행
        staleTime: 1000 * 60 * 5, // 5분 캐싱
    });

    if (isLoading) return <p>장바구니 로딩 중...</p>;
    if (isError) {
        if (error.response && error.response.status === 401) {
            return <p>장바구니를 불러오려면 다시 로그인해주세요. (세션이 만료되었거나 유효하지 않습니다.)</p>;
        }
        return <p>장바구니 불러오기 에러: {error.message}</p>;
    }
    if (!auth.isAuthenticated) return <p>장바구니를 보려면 로그인이 필요합니다.</p>;


    return(
        <>
            <CartCom
                cartItems={cartItems || []} // 데이터가 없을 경우 빈 배열 전달
                selectedCartItems={selectedCartItems}
                setSelectedCartItems={setSelectedCartItems}
            />
        </>
    )
}
export default CartCon;