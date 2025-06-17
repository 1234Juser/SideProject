import {Card, CardsWrapper, CTAButton, Highlight, Section, SectionTitle} from "../../style/member/StyleMyPage";


function MyPageCom() {
    const hasOngoingOrder = false; // 예시
    const hasRecentOrderWithoutReview = true;

    return (
        <>
                <Section>
                    <SectionTitle>멤버십</SectionTitle>
                    <CardsWrapper>
                        <Card>
                            <span>지금은 <Highlight>Gold 멤버</Highlight>예요 ✨</span>
                            <span>다음 단계까지 <Highlight>5잔</Highlight>만 더 주문하시면</span>
                            <span><Highlight>VIP</Highlight> 멤버로 승급돼요</span>
                        </Card>
                        <Card>
                            <span>현재 스탬프: <Highlight>7개</Highlight> / 10개 (무료 음료 1잔)</span>
                            <hr style={{margin: '15px 0', borderColor: '#eee'}} />
                            <span>다음 무료 음료까지 <Highlight>3개</Highlight> 남았어요!</span>
                        </Card>
                        <Card>
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
        </>
    )
}

export default MyPageCom
