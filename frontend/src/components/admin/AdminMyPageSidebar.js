import {Sidebar, SidebarItem} from "../../style/member/StyleMyPageSidebar";
import {Link} from "react-router-dom";

const AdminSidebar = () => {
    return (
        <Sidebar>
            <SidebarItem>
                <Link  to="/admin/member-list">
                    회원 관리
                </Link>
            </SidebarItem>
            <SidebarItem>메뉴 관리</SidebarItem>
            <SidebarItem>주문 관리</SidebarItem>
            <SidebarItem>리뷰 관리</SidebarItem>
            <SidebarItem>1:1 문의 관리</SidebarItem>
            <SidebarItem>통계 및 분석</SidebarItem>
        </Sidebar>
    );
};

export default AdminSidebar;