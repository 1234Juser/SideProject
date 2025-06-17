import { useState } from 'react'; // useState import 추가
import {
    Card,
    CTAButton,
    MyPageContainer,
    MyPageContentArea,
    Section,
    SectionTitle, Highlight, CardsWrapper
} from "../../style/member/StyleMyPage";
import {Sidebar, SidebarItem, DropdownItem} from "../../style/member/StyleMyPageSidebar";
import {Link} from "react-router-dom"; // DropdownItem import 추가


const MyPageSidebar = () => {
    const [showInquiryDropdown, setShowInquiryDropdown] = useState(false); // 드롭다운 상태 추가

    const handleInquiryClick = () => {
        setShowInquiryDropdown(!showInquiryDropdown); // 드롭다운 토글
    };

    return (
        <Sidebar>
            <SidebarItem>
                주문 내역
            </SidebarItem>
            <SidebarItem>
                포인트 조회
            </SidebarItem>
            <SidebarItem>
                찜한 메뉴
            </SidebarItem>
            <SidebarItem>
                나의 리뷰
            </SidebarItem>
            <SidebarItem>
                내 정보
            </SidebarItem>
            <SidebarItem onClick={handleInquiryClick}> {/* 클릭 이벤트 추가 */}
                1:1문의
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


function MyPageCom() {
    const hasOngoingOrder = false; // 예시
    const hasRecentOrderWithoutReview = true;

    return (
        <MyPageContainer>
            <MyPageSidebar />
            <MyPageContentArea>
                <Section>
                    <SectionTitle>멤버십</SectionTitle>
                    <CardsWrapper>
                        <Card>
                            <span>지금은 <Highlight>Gold 멤버</Highlight>예요 ✨</span>
                            <span>다음 단계까지 <Highlight>5잔</Highlight>만 더 주문하시면</span>
                            <span><Highlight>VIP</Highlight> 멤버로 승급돼요</span>
                        </Card>
                        {/*<SectionTitle>보유 혜택</SectionTitle>*/}
                        <Card>
                            <span>적립금: <Highlight>1,200원</Highlight><br /></span>
                            <span>사용 가능한 쿠폰: <Highlight>2장</Highlight></span>
                        </Card>
                    </CardsWrapper>
                </Section>

                <Section style={{backgroundColor : '#FFFFFF'}}>
                    <SectionTitle>주문 내역</SectionTitle>
                    {hasOngoingOrder ? (
                        <Card>
                            <span>아메리카노 1잔 준비 중 ☕️</span><br />
                            <span>픽업 예정 시간: 14:30</span>
                        </Card>
                    ) : hasRecentOrderWithoutReview ? (
                        <Card>
                            <span>최근 주문: 아인슈페너 / 홍대점 / 6월 10일</span><br />
                            <span>지난 주문에 리뷰를 남겨주시면 적립금 500원 드려요! 💰</span><br />
                            <CTAButton>리뷰 쓰기</CTAButton>
                        </Card>
                    ) : (
                        <Card>
                            <span>진행 중인 주문이 없습니다.</span><br />
                            <span>오늘도 테이크아웃 하실래요?</span><br />
                            <CTAButton>주문하러 가기</CTAButton>
                        </Card>
                    )}
                </Section>

                <Section>
                    <SectionTitle>1:1 문의 내역</SectionTitle>
                    <Card>
                        6월 5일 | 주문 취소 문의 | 답변 완료 ✅
                    </Card>
                </Section>
            </MyPageContentArea>
        </MyPageContainer>
    )
}

export default MyPageCom