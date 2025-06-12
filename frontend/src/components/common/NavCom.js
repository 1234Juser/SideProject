import {CenterMenu, NavWrapper, MenuDropdownContainer, MenuDropdown, DropdownContent} from "../../style/common/StyleNav";
import {Link} from "react-router-dom";

const NavCom = () => {
    return (
        <NavWrapper>
            <CenterMenu>
                <Link to="/">홈</Link>
                <Link to="/menu">커피</Link>
                <Link to="/stores">음료</Link>
                <Link to="/orders">디저트</Link>
                <Link to="/cart">장바구니</Link>
                <Link to="/mypage">마이페이지</Link>
                <MenuDropdownContainer>
                    <MenuDropdown
                        tabIndex="0"
                        role="button"
                        aria-haspopup="true"
                    >
                        1:1문의
                    </MenuDropdown>
                    <DropdownContent>
                        <Link to="/inquiry">1:1문의하기</Link>
                        <Link to="/inquiry-chat">1:1문의채팅</Link>
                    </DropdownContent>
                </MenuDropdownContainer>
            </CenterMenu>
        </NavWrapper>
    );
}

export default NavCom;