import HeaderCom from "../../components/common/HeaderCom";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../utils/AuthContext";

function HeaderCon() {

    const { auth, logout } = useAuth(); // AuthContext의 auth 상태와 logout 함수 사용
    const navigate = useNavigate(); // 로그아웃 후 리다이렉트를 위해 useNavigate 사용

    console.log('auth ------->', auth);

    const handleLogout = () => {
        logout(); // AuthContext의 로그아웃 함수 호출
        alert('로그아웃되었습니다.');
        navigate('/'); // 로그아웃 후 홈으로 이동
    };


    return(
        <>
            <HeaderCom handleLogout={handleLogout} auth={auth}/>
        </>
    )
}

export  default HeaderCon