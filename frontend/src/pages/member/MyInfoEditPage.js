import MemberDashboardLayout from "../../layouts/MemberDashboardLayout";
import MyInfoEditCon from "../../containers/member/MyInfoEditCon";

function MyInfoEditPage(props) {
    return (
        <MemberDashboardLayout>
            <MyInfoEditCon/>
        </MemberDashboardLayout>
    );
}

export default MyInfoEditPage;