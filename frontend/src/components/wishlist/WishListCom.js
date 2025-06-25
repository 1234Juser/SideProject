import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { fetchWishlists, removeWishlist } from '../../service/wishlistService';
import { Link, useNavigate } from 'react-router-dom';
import {
    WishListContainer,
    WishListTitle,
    WishlistGrid,
    WishlistItem,
    WishlistImage,
    WishlistInfo,
    WishlistName,
    WishlistDescription,
    WishlistPrice,
    RemoveButton
} from '../../style/wishlist/WishListStyle';

function WishListCom() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getWishlists = async () => {
            if (!auth.isAuthenticated || !auth.accessToken) {
                alert('찜 목록을 보려면 로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            setIsLoading(true);
            try {
                const data = await fetchWishlists(auth.accessToken);
                setWishlist(data);
                setError(null);
            } catch (err) {
                // console.error("찜 목록 불러오기 실패:", err);
                setError('찜 목록을 불러오는 데 실패했습니다.');
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
                    navigate('/login');
                }
                setWishlist([]); // 에러 발생 시 목록 비우기
            } finally {
                setIsLoading(false);
            }
        };

        getWishlists();
    }, [auth.isAuthenticated, auth.accessToken, navigate]);

    const handleRemoveWishlist = async (menuId, menuName) => {
        if (!auth.isAuthenticated || !auth.accessToken) {
            alert('찜 취소 기능을 사용하려면 로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (window.confirm(`${menuName} 메뉴를 찜 목록에서 삭제하시겠습니까?`)) {
            try {
                await removeWishlist(menuId, auth.accessToken);
                alert(`${menuName} 찜 목록에서 삭제되었습니다.`);
                // 성공적으로 삭제되면 목록에서 해당 아이템 제거
                setWishlist(prevWishlist => prevWishlist.filter(item => item.menuId !== menuId));
            } catch (err) {
                // console.error("찜 취소 실패:", err);
                const errorMessage = err.response?.data || err.message;
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
                    navigate('/login');
                } else {
                    alert(`찜 취소 중 오류가 발생했습니다: ${errorMessage}`);
                }
            }
        }
    };

    if (isLoading) {
        return <WishListContainer><p>찜 목록을 로딩 중입니다...</p></WishListContainer>;
    }

    if (error) {
        return <WishListContainer><p style={{ color: 'red' }}>{error}</p></WishListContainer>;
    }

    return (
        <WishListContainer>
            <WishListTitle>나의 찜 목록</WishListTitle>
            {wishlist.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#555' }}>찜 목록이 비어 있습니다.</p>
            ) : (
                <WishlistGrid>
                    {wishlist.map((item) => (
                        <WishlistItem key={item.wishlistId}>
                            <Link to={`/menu/detail/${item.menuId}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <WishlistImage src={`http://localhost:8080${item.menuImageUrl}`} alt={item.menuName} />
                                <WishlistInfo>
                                    <WishlistName>{item.menuName}</WishlistName>
                                    <WishlistDescription>{item.menuDescription}</WishlistDescription>
                                    <WishlistPrice>{item.menuPrice.toLocaleString()}원</WishlistPrice>
                                </WishlistInfo>
                            </Link>
                            <RemoveButton onClick={() => handleRemoveWishlist(item.menuId, item.menuName)}>
                                찜 취소
                            </RemoveButton>
                        </WishlistItem>
                    ))}
                </WishlistGrid>
            )}
        </WishListContainer>
    );
}

export default WishListCom;