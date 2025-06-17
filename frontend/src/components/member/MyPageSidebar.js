import {Sidebar, SidebarItem, DropdownItem} from "../../style/member/StyleMyPageSidebar";
import {Link} from "react-router-dom";
import {useState} from "react";

const MyPageSidebar = () => {
    const [showInquiryDropdown, setShowInquiryDropdown] = useState(false); // 드롭다운 상태 추가

    const handleInquiryClick = () => {
        setShowInquiryDropdown(!showInquiryDropdown); // 드롭다운 토글
    };
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
            <SidebarItem onClick={handleInquiryClick}> {/* 클릭 이벤트 추가 */}
                나의 1:1문의
            </SidebarItem>
            {showInquiryDropdown && (
                <>
                    <DropdownItem>
                        <Link to="/member/inquiries">
                            1:1일반문의
                        </Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to="/member/chat-inquiries">
                            1:1채팅문의
                        </Link>
                    </DropdownItem>
                </>
            )}
        </Sidebar>
    );
};

export default MyPageSidebar;