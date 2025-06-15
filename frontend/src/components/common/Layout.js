import {useLocation} from "react-router-dom";
import HeaderCon from "../../containers/common/HeaderCon";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const MainLayout = ({ children }) => {

    const location = useLocation();

    const hiddenHeaderPaths = ['/signup', '/login'];
    const hideHeader = hiddenHeaderPaths.includes(location.pathname);


    return (
        <div>
            {!hideHeader && (
                <LayoutWrapper>
                    <HeaderCon />
                </LayoutWrapper>
            )}
            <main style={{ paddingTop: '60px' }}>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </main>
        </div>
    );
};

export default MainLayout;