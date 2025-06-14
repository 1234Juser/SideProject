import {
    CenterMenu,
    NavWrapper,
    DropdownContainer,
    DropdownMenu,
    DropdownItem,
    DropdownTrigger
} from "../../style/common/StyleNav";
import {useState} from "react";
import {Link} from "react-router-dom";

const NavCom = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    let leaveTimeout;

    const handleMouseEnter = () => {
        clearTimeout(leaveTimeout);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        leaveTimeout = setTimeout(() => {
            setDropdownOpen(false);
        }, 100); // 0.2초 후에 메뉴가 사라지도록 설정
    };

    return (
        <NavWrapper>
            <CenterMenu>
                <Link to="/">홈</Link>
                <Link to="/menu/coffee">커피</Link>
                <Link to="/menu/non_coffee">음료</Link>
                <Link to="/menu/dessert">디저트</Link>
                <Link to="/cart">장바구니</Link>
                <Link to="/mypage">마이페이지</Link>
                <DropdownContainer
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <DropdownTrigger>1:1문의</DropdownTrigger>
                    {isDropdownOpen && (
                        <DropdownMenu>
                            <DropdownItem>
                                <Link to="/inquiry">1:1일반문의</Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to="/chat-inquiry">1:1채팅문의</Link>
                            </DropdownItem>
                        </DropdownMenu>
                    )}
                </DropdownContainer>
            </CenterMenu>
        </NavWrapper>
    );
}

export default NavCom;