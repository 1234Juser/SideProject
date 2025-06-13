import NavCom from './NavCom';
import {HeaderWrapper, Logo, TopButtons, TopRow} from "../../style/common/StyleHeader";
import {Link} from "react-router-dom";



const HeaderCom = () => (
    <HeaderWrapper>
        <TopRow>
            <Logo>NowPick</Logo>
            <TopButtons>
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
            </TopButtons>
        </TopRow>
        <NavCom />
    </HeaderWrapper>
);

export default HeaderCom;
