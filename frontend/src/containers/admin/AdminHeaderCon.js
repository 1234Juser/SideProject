import {useNavigate} from "react-router-dom";
import {useAuth} from "../../utils/AuthContext";
import AdminHeaderCom from "../../components/admin/AdminHeaderCom";

function AdminHeaderCon() {

    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    console.log('auth ------->', auth);

    const handleLogout = () => {
        logout();
        alert('로그아웃되었습니다.');
        navigate('/');
    };


    return(
        <>
            <AdminHeaderCom handleLogout={handleLogout} auth={auth}/>
        </>
    )
}

export  default AdminHeaderCon