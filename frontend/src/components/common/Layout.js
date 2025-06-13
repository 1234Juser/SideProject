import {useLocation} from "react-router-dom";
import HeaderCon from "../../containers/common/HeaderCon";

const MainLayout = ({ children }) => {

    const location = useLocation();

    const hiddenHeaderPaths = ['/signup', '/login'];
    const hideHeader = hiddenHeaderPaths.includes(location.pathname);


    return (
        <div>
            {!hideHeader && <HeaderCon />}
            <main style={{ paddingTop: '60px' }}> {/* 헤더 높이만큼 패딩 조정 */}
                {children}
            </main>
        </div>
    );
};

export default MainLayout;