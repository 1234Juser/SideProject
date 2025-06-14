import {CenterMenu, NavWrapper} from "../../style/common/StyleNav";
import {useState} from "react";
import {Link} from "react-router-dom";

const NavCom = () => {
        const [open, setOpen] = useState(false);

        return (
            <NavWrapper>
                <CenterMenu>
                    <Link to="/">홈</Link>
                    <Link to="/menu/coffee">커피</Link>
                    <Link to="/menu/non_coffee">음료</Link>
                    <Link to="/menu/dessert">디저트</Link>
                    <Link to="/cart">장바구니</Link>
                    <Link to="/mypage">마이페이지</Link>
                </CenterMenu>
            </NavWrapper>
        );
}

export default NavCom;
