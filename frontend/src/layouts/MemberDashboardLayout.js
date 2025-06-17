import React from 'react';
import MyPageSidebar from "../components/member/MyPageSidebar";
import {MyPageContainer, MyPageContentArea} from "../style/member/StyleMyPage";

const MemberDashboardLayout = ({ children }) => {
    return (
        <MyPageContainer>
            <MyPageSidebar/>
            <MyPageContentArea>
                {children}
            </MyPageContentArea>
        </MyPageContainer>
    );
};

export default MemberDashboardLayout;