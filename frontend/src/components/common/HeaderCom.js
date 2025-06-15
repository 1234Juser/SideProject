import NavCom from './NavCom';
import {
    HeaderWrapper,
    Logo,
    NicknameSpan,
    StyledLink,
    TopButtons,
    TopRow,
    UserInfoContainer
} from "../../style/common/StyleHeader";


const HeaderCom = ({handleLogout, auth}) => {

    return (
            <HeaderWrapper>
                <TopRow>
                    <Logo>NowPick</Logo>
                    <TopButtons>
                        {auth.isAuthenticated ? (
                            <>
                                <UserInfoContainer>
                                    <NicknameSpan>환영합니다, {auth.memberNickname}님!</NicknameSpan>
                                    <StyledLink to="/mypage">
                                        마이페이지
                                    </StyledLink>
                                    <StyledLink to="/" onClick={handleLogout}>
                                        로그아웃
                                    </StyledLink>
                                </UserInfoContainer>
                            </>
                        ) : (
                            <>
                                <StyledLink to="/login">로그인</StyledLink>
                                <StyledLink to="/signup">회원가입</StyledLink>
                            </>
                        )}
                    </TopButtons>
                </TopRow>
                <NavCom/>
            </HeaderWrapper>
    )
};

export default HeaderCom;
