import {
    HeaderWrapper,
    Logo,
    NicknameSpan,
    StyledLink,
    TopButtons,
    TopRow,
    UserInfoContainer
} from "../../style/common/StyleHeader";


const AdminHeaderCom = ({handleLogout, auth}) => {


    return (
        <HeaderWrapper>
            <TopRow>
                <Logo>NowPick</Logo>
                <TopButtons>
                            <UserInfoContainer>
                                <NicknameSpan>환영합니다, {auth.memberNickname}님!</NicknameSpan>
                                <StyledLink to="/" onClick={handleLogout}>
                                    로그아웃
                                </StyledLink>
                                <StyledLink to="/">
                                    메인으로
                                </StyledLink>
                            </UserInfoContainer>
                </TopButtons>
            </TopRow>
        </HeaderWrapper>
    )
};

export default AdminHeaderCom;
