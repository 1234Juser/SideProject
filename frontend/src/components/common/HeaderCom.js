import NavCom from './NavCom';
import {HeaderWrapper, Logo, TopButtons, TopRow} from "../../style/common/StyleHeader";
import {Link} from "react-router-dom";
import {useEffect} from "react";



const HeaderCom = ({handleLogout, auth}) => {

    // HeaderCom이 auth prop을 받을 때마다 로그 출력
    // 이 로그는 디버깅을 위해 추가되었습니다. 문제가 해결되면 제거하셔도 됩니다.
    useEffect(() => {
        console.log('HeaderCom received auth prop (in useEffect):', auth);
    }, [auth]); // auth prop이 변경될 때마다 실행


    return (
            <HeaderWrapper>
                <TopRow>
                    <Logo>NowPick</Logo>
                    <TopButtons>
                        {auth.isAuthenticated ? ( // 로그인 상태에 따라 다른 버튼 렌더링
                            <>
                                <span style={{ marginRight: '10px' }}>환영합니다, {auth.memberNickname }님!</span>
                                <button onClick={handleLogout}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'inherit',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}>
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">로그인</Link>
                                <Link to="/signup">회원가입</Link>
                            </>
                        )}
                    </TopButtons>
                </TopRow>
                <NavCom/>
            </HeaderWrapper>
    )
};

export default HeaderCom;
