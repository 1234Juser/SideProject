import {
    MenuCard, MenuCategory, MenuDescription, MenuIce,
    MenuImage,
    MenuInfo,
    MenuList,
    MenuListContainer,
    MenuListTitle, MenuName, MenuPrice,
    MenuActionsContainer, ActionButton, ActionIcon
} from "../../style/menu/StyleMenuList";
import {Link} from "react-router-dom";

import { FaHeart, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { addWishlist, removeWishlist, fetchWishlists } from '../../service/wishlistService';
import { addCartItem, removeCartItem, fetchCartItems } from '../../service/CartService';
import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import {useQueryClient} from "@tanstack/react-query";



const getCategoryKorean = (category) => {
    switch (category) {
        case 'COFFEE':
            return '커피';
        case 'NON_COFFEE':
            return '논커피';
        case 'DESSERT':
            return '디저트';
        default:
            return category;
    }
};

function MenuListCom({ menuList }) {
    const { auth } = useAuth(); // AuthContext에서 인증 정보 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [wishlistStatus, setWishlistStatus] = useState({});
    const [cartStatus, setCartStatus] = useState({}); // 장바구니 상태 추가
    const queryClient = useQueryClient(); // queryClient 초기화



    // 컴포넌트 마운트 시 또는 로그인 상태 변경 시 찜 목록을 불러와 찜 상태를 업데이트
    useEffect(() => {
        if (auth.isAuthenticated && auth.accessToken) {
            // 로그인되어 있으면 찜 목록을 불러옴
            fetchWishlists(auth.accessToken)
                .then(data => {
                    const status = {};
                    data.forEach(item => {
                        status[item.menuId] = true; // 찜 되어있으면 true
                    });
                    setWishlistStatus(status);
                })
                .catch(error => {
                    // console.error("찜 목록 불러오기 실패:", error);
                    // 에러가 401/403이면 로그인이 필요하다고 알림
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        alert('찜 목록을 불러오려면 로그인이 필요합니다.');
                    } else {
                        alert('찜 목록을 불러오는 중 오류가 발생했습니다.');
                    }
                });
            // 로그인되어 있으면 장바구니 목록을 불러옴
            fetchCartItems(auth.accessToken)
                .then(data => {
                    const status = {};
                    data.forEach(item => {
                        status[item.menu.menuId] = {
                            inCart: true,
                            cartItemId: item.cartItemId,
                            quantity: item.quantity
                        };
                    });
                    setCartStatus(status);
                })
                .catch(error => {
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        alert('장바구니 목록을 불러오려면 로그인이 필요합니다.');
                    } else {
                        alert('장바구니 목록을 불러오는 중 오류가 발생했습니다.');
                    }
                });
        } else {
            // 로그아웃 상태면 찜 및 장바구니 상태 초기화
            setWishlistStatus({});
            setCartStatus({});
        }
    }, [auth.isAuthenticated, auth.accessToken]);


    const handleWishlistClick = async (menuId, menuName) => {
        if (!auth.isAuthenticated || !auth.accessToken) {
            alert('찜 기능을 사용하려면 로그인이 필요합니다.');
            navigate('/login'); // 로그인 페이지로 이동
            return;
        }

        const isWished = wishlistStatus[menuId];

        try {
            if (isWished) {
                // 찜 취소
                await removeWishlist(menuId, auth.accessToken);
                alert(`${menuName} 찜 취소되었습니다.`);
                setWishlistStatus(prevStatus => ({ ...prevStatus, [menuId]: false }));
            } else {
                // 찜 등록
                await addWishlist(menuId, auth.accessToken);
                alert(`${menuName} 찜 목록에 추가되었습니다.`);
                setWishlistStatus(prevStatus => ({ ...prevStatus, [menuId]: true }));
            }
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
                navigate('/login');
            } else {
                alert(`찜 처리 중 오류가 발생했습니다: ${errorMessage}`);
            }
        }
    };

    const handleCartClick = async (menuId, menuName) => {
        if (!auth.isAuthenticated || !auth.accessToken) {
            alert('장바구니 기능을 사용하려면 로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const isInCart = cartStatus[menuId]?.inCart;
        const cartItemId = cartStatus[menuId]?.cartItemId;

        try {
            if (isInCart) {
                await removeCartItem(cartItemId, auth.accessToken);
                alert(`${menuName} 장바구니에서 제거되었습니다.`);
                setCartStatus(prevStatus => {
                    const newStatus = { ...prevStatus };
                    delete newStatus[menuId];
                    return newStatus;
                });
                queryClient.invalidateQueries(['cartItems']); // 장바구니 항목 제거 후 쿼리 무효화
            } else {
                const addedItem = await addCartItem(menuId, 1, auth.accessToken); // 수량 1로 추가
                alert(`${menuName} 장바구니에 추가되었습니다.`);
                setCartStatus(prevStatus => ({
                    ...prevStatus,
                    [menuId]: {
                        inCart: true,
                        cartItemId: addedItem.cartItemId,
                        quantity: 1 // 추가 시 수량은 1로 설정
                    }
                }));
                queryClient.invalidateQueries(['cartItems']); // 장바구니 항목 추가 후 쿼리 무효화
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
                navigate('/login');
            } else {
                alert(`장바구니 처리 중 오류가 발생했습니다: ${errorMessage}`);
            }
        }
    };


    const handleCheckoutClick = (menu) => { // 변경: menuId, menuName 대신 전체 menu 객체 받음
        if (!auth.isAuthenticated) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        // 단일 상품을 즉시 구매하는 경우, 기본 수량을 1로 설정하여 OrderCom으로 전달
        navigate('/order-confirm', { state: { menu: menu, quantity: 1 } });
    };


    if (!menuList || menuList.length === 0) {
        return <MenuListContainer><p>메뉴가 없습니다.</p></MenuListContainer>;
    }

    return (
        <MenuListContainer>
            <MenuListTitle>전체 메뉴</MenuListTitle>
            <MenuList>
                {menuList.map((menu) => (
                    <Link to={`/menu/detail/${menu.menuId}`} key={menu.menuId} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuCard key={menu.menuId}>
                            <MenuImage src={`http://localhost:8080${menu.menuImageUrl}`} alt={menu.menuName} />
                            <MenuInfo>
                                <MenuName>{menu.menuName}</MenuName>
                                <MenuDescription>{menu.menuDescription}</MenuDescription>
                                <MenuPrice>{menu.menuPrice.toLocaleString()}원</MenuPrice>
                                <MenuCategory>카테고리: {getCategoryKorean(menu.menuCategory)}</MenuCategory>
                                <MenuIce>{menu.menuIsIceAvailable ? '아이스 가능' : '아이스 불가'}</MenuIce>
                                <MenuActionsContainer>
                                    {/* 로그인 상태에 따라 찜 버튼 활성화/비활성화 */}
                                    <ActionButton
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleWishlistClick(menu.menuId, menu.menuName);
                                        }}
                                        disabled={!auth.isAuthenticated}
                                    >
                                        <ActionIcon>
                                            <FaHeart color={wishlistStatus[menu.menuId] ? 'red' : 'inherit'} />
                                        </ActionIcon>
                                        {wishlistStatus[menu.menuId] ? '찜 취소' : '찜하기'}
                                    </ActionButton>
                                    <ActionButton
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCartClick(menu.menuId, menu.menuName);
                                        }}
                                        disabled={!auth.isAuthenticated}
                                    >
                                        <ActionIcon><FaShoppingCart /></ActionIcon>
                                        {cartStatus[menu.menuId]?.inCart ? '장바구니에서 제거' : '장바구니'}
                                    </ActionButton>
                                    <ActionButton onClick={(e) => {
                                        e.preventDefault();
                                        handleCheckoutClick(menu);
                                    }}
                                                  disabled={!auth.isAuthenticated}
                                    >

                                    <ActionIcon><FaCreditCard /></ActionIcon>
                                        바로구매
                                    </ActionButton>
                                </MenuActionsContainer>
                            </MenuInfo>
                        </MenuCard>
                    </Link>
                ))}
            </MenuList>
        </MenuListContainer>
    );
}
export default MenuListCom;