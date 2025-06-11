import NavCom from './NavCom';
import {HeaderWrapper, Logo, TopButtons, TopRow} from "../../style/common/StyleHeader";



const HeaderCom = () => (
    <HeaderWrapper>
        <TopRow>
            <Logo>NowPick</Logo>
            <TopButtons>
                <button>로그인</button>
                <button>회원가입</button>
            </TopButtons>
        </TopRow>
        <NavCom />
    </HeaderWrapper>
);

export default HeaderCom;
