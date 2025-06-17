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

    const getMyPagePath = () => {
        if (auth.isAuthenticated && auth.memberRole === "ROLE_ADMIN") {
            console.log("Admin role detected, path: /admin/mypage"); // 디버깅용
            return "/admin/mypage";
        } else {
            console.log("User role detected, path: /mypage"); // 디버깅용
            return "/mypage";
        }
    };



    return (
            <HeaderWrapper>
                <TopRow>
                    <Logo>NowPick</Logo>
                    <TopButtons>
                        {auth.isAuthenticated ? (
                            <>
                                <UserInfoContainer>
                                    <NicknameSpan>환영합니다, {auth.memberNickname}님!</NicknameSpan>
                                    <StyledLink to={getMyPagePath()}>
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
            </HeaderWrapper>
    )
};

export default HeaderCom;
