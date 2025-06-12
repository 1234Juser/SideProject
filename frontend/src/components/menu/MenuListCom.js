import {
    MenuCard, MenuCategory, MenuDescription, MenuIce,
    MenuImage,
    MenuInfo,
    MenuList,
    MenuListContainer,
    MenuListTitle, MenuName, MenuPrice
} from "../../style/menu/StyleMenuList";

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
    if (!menuList || menuList.length === 0) {
        return <MenuListContainer><p>메뉴가 없습니다.</p></MenuListContainer>;
    }

    return (
        <MenuListContainer>
            <MenuListTitle>전체 메뉴</MenuListTitle>
            <MenuList>
                {menuList.map((menu) => (
                    <MenuCard key={menu.menuId}>
                        <MenuImage src={`http://localhost:8080${menu.menuImageUrl}`} alt={menu.menuName} />
                        <MenuInfo>
                            <MenuName>{menu.menuName}</MenuName>
                            <MenuDescription>{menu.menuDescription}</MenuDescription>
                            <MenuPrice>{menu.menuPrice.toLocaleString()}원</MenuPrice>
                            <MenuCategory>카테고리: {getCategoryKorean(menu.menuCategory)}</MenuCategory>
                            <MenuIce>{menu.menuIsIceAvailable ? '아이스 가능' : '아이스 불가'}</MenuIce>
                        </MenuInfo>
                    </MenuCard>
                ))}
            </MenuList>
        </MenuListContainer>
    );
}

export default MenuListCom;
