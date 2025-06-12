import HeaderCom from "./HeaderCom";

const MainLayout = ({ children }) => {
    return (
        <div>
            <HeaderCom />
            <main style={{ paddingTop: '60px' }}> {/* 헤더 높이만큼 패딩 조정 */}
                {children}
            </main>
        </div>
    );
};

export default MainLayout;