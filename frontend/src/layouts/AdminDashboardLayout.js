import {AdminContentArea, AdminPageContainer,} from "../style/admin/StyleAdminMyPage";
import AdminSidebar from "../components/admin/AdminMyPageSidebar";
import AdminHeaderCon from "../containers/admin/AdminHeaderCon";


const AdminDashboardLayout = ({ children }) => {
    return (
        <>
        <AdminHeaderCon/>
        <AdminPageContainer>
            <AdminSidebar />
            <AdminContentArea>
                {children}
            </AdminContentArea>
        </AdminPageContainer>
        </>
    );
};

export default AdminDashboardLayout;