import {
    BestMenuTitle,
    MainSubtitle,
    MainTitle,
    MainWrapper,
    MenuItem,
    MenuList,
    ViewMoreButton
} from "../../style/common/StyleMain";
import HeaderCom from "./HeaderCom";

function MainCom() {

    return (
        <MainWrapper>
            <HeaderCom />
            <MainTitle>Cafe NowPick</MainTitle>
            <MainSubtitle>줄 서지 말고, 미리 주문하세요!</MainSubtitle>
            <MainSubtitle>당신의 시간을 아끼는 카페 서비스</MainSubtitle>
            <ViewMoreButton>더 많은 메뉴 보기</ViewMoreButton>
            <BestMenuTitle>주문 베스트</BestMenuTitle>
            <MenuList>
                <MenuItem><img src="http://localhost:8080/images/coffee/iced_americano.png" alt="메뉴1"/></MenuItem>
                <MenuItem><img src="http://localhost:8080/images/coffee/iced_cafelatte.png" alt="메뉴2"/></MenuItem>
                <MenuItem><img src="http://localhost:8080/images/dessert/salt-bread.png" alt="메뉴3"/></MenuItem>
                <MenuItem><img src="http://localhost:8080/images/dessert/melon-bread.jpg" alt="메뉴4"/></MenuItem>
            </MenuList>
        </MainWrapper>
    )
}

export  default MainCom