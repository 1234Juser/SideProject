import {
    AdminCard,
    AdminCardsWrapper,
    AdminCTAButton,
    AdminHighlight,
    AdminSection,
    AdminSectionTitle
} from "../../style/admin/StyleAdminMyPage";


function AdminMyPageCom() {
    // 관리자 페이지에 필요한 데이터 (예시)
    const totalUsers = 1500;
    const pendingOrders = 5;
    const unreadInquiries = 3;


    return (
            <>
                <AdminSection>
                    <AdminSectionTitle>관리자 대시보드</AdminSectionTitle>
                    <AdminCardsWrapper>
                        <AdminCard>
                            <span>총 회원 수: <AdminHighlight>{totalUsers}명</AdminHighlight></span>
                            <span>오늘 신규 가입: <AdminHighlight>10명</AdminHighlight></span>
                        </AdminCard>
                        <AdminCard>
                            <span>오늘 매출: <AdminHighlight>500,000원</AdminHighlight></span>
                            <span>이번 달 매출: <AdminHighlight>15,000,000원</AdminHighlight></span>
                        </AdminCard>
                    </AdminCardsWrapper>
                </AdminSection>

                <AdminSection style={{backgroundColor : '#FFFFFF'}}>
                    <AdminSectionTitle>실시간 현황</AdminSectionTitle>
                    {pendingOrders > 0 ? (
                        <AdminCard>
                            <span>처리 대기 중인 주문: <AdminHighlight>{pendingOrders}건</AdminHighlight> 🚨</span><br />
                            <span>최근 주문: 아메리카노 2잔 / 강남점 / 15:00</span><br />
                            <AdminCTAButton>주문 처리</AdminCTAButton>
                        </AdminCard>
                    ) : (
                        <AdminCard>
                            <span>현재 처리 대기 중인 주문이 없습니다. ✅</span><br />
                            <span>모든 주문이 정상적으로 처리되었습니다.</span>
                        </AdminCard>
                    )}
                </AdminSection>

                <AdminSection>
                    <AdminSectionTitle>관리 필요 항목</AdminSectionTitle>
                    {unreadInquiries > 0 ? (
                        <AdminCard>
                            <span>미답변 1:1 문의: <AdminHighlight>{unreadInquiries}건</AdminHighlight> ✉️</span><br />
                            <span>최근 문의: 6월 15일 | 결제 오류 문의</span><br />
                            <AdminCTAButton>문의 확인</AdminCTAButton>
                        </AdminCard>
                    ) : (
                        <AdminCard>
                            <span>미답변 1:1 문의가 없습니다. 👏</span><br />
                            <span>모든 문의에 답변 완료되었습니다.</span>
                        </AdminCard>
                    )}
                </AdminSection>

                <AdminSection>
                    <AdminSectionTitle>공지 및 알림</AdminSectionTitle>
                    <AdminCard>
                        6월 10일 | 시스템 점검 안내 | 완료
                    </AdminCard>
                </AdminSection>
            </>
    )
}

export default AdminMyPageCom
