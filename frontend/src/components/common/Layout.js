import HeaderCom from "./HeaderCom";
import {useLocation} from "react-router-dom";

const MainLayout = ({ children }) => {

    const location = useLocation();

    const hiddenHeaderPaths = ['/signup', '/login'];
    const hideHeader = hiddenHeaderPaths.includes(location.pathname);


    return (
        <div>
            {!hideHeader && <HeaderCom />} {/* 조건부 렌더링 */}
            <main style={{ paddingTop: '60px' }}> {/* 헤더 높이만큼 패딩 조정 */}
                {children}
            </main>
        </div>
    );
};

export default MainLayout;