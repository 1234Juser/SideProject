import {useLocation} from "react-router-dom";
import HeaderCon from "../containers/common/HeaderCon";
import styled from "styled-components";
import NavCom from "../components/common/NavCom";

const LayoutWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const MainLayout = ({ children }) => {

    const location = useLocation();

    // 헤더 숨기기
    const hiddenHeaderPaths = ['/signup', '/login'];
    const hideHeader = hiddenHeaderPaths.includes(location.pathname) || location.pathname.startsWith('/admin');

    // 메인 콘텐츠 영역의 LayoutWrapper를 숨길지 여부 (관리자 페이지는 full-width를 적용하기 위함)
    const hideLayoutWrapperForContent = location.pathname.startsWith('/admin');



    return (
        <div>
            {!hideHeader && (
                <LayoutWrapper>
                    <HeaderCon />
                    <NavCom/>
                </LayoutWrapper>
            )}
                {hideLayoutWrapperForContent ? (
                    children
                ) : (
                    <main style={{ paddingTop: '60px' }}>
                        <LayoutWrapper>
                            {children}
                        </LayoutWrapper>
                    </main>
                )}
        </div>
    );
};

export default MainLayout;