import {Sidebar, SidebarItem} from "../../style/member/StyleMyPageSidebar";
import {Link} from "react-router-dom";

const MyPageSidebar = () => {
    return (
        <Sidebar>
            <SidebarItem>
                멤버십
            </SidebarItem>
            <SidebarItem>
                주문 내역
            </SidebarItem>
            <SidebarItem>
                찜한 메뉴
            </SidebarItem>
            <SidebarItem>
                나의 리뷰
            </SidebarItem>
            <Link to="/mypage/my-info">
                <SidebarItem>
                        내 정보
                </SidebarItem>
            </Link>
        </Sidebar>
    );
};

export default MyPageSidebar;