import {DropdownItem, Sidebar, SidebarItem} from "../../style/member/StyleMyPageSidebar";
import {Link} from "react-router-dom";
import {useState} from "react";


const AdminSidebar = () => {
    const [showInquiryDropdown, setShowInquiryDropdown] = useState(false); // 드롭다운 상태 추가

    const handleInquiryClick = () => {
        setShowInquiryDropdown(!showInquiryDropdown); // 드롭다운 토글
    };

    return (
        <Sidebar>
            <SidebarItem>
                <Link  to="/admin/member-list">
                    회원 관리
                </Link>
            </SidebarItem>
            <SidebarItem>메뉴 관리</SidebarItem>
            <Link to="/adminmypage/payment">
                <SidebarItem>
                    주문 관리
                </SidebarItem>
            </Link>
            <SidebarItem>리뷰 관리</SidebarItem>
            <SidebarItem onClick={handleInquiryClick}> {/* 클릭 이벤트 추가 */}
                1:1문의관리
            </SidebarItem>
            {showInquiryDropdown && (
                <>
                    <DropdownItem>
                        <Link to="/admin/inquiries">
                            1:1일반문의
                        </Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to="/admin/chat-inquiries">
                            1:1채팅문의
                        </Link>
                    </DropdownItem>
                </>
            )}
            <SidebarItem>통계 및 분석</SidebarItem>
        </Sidebar>
    );
};

export default AdminSidebar;