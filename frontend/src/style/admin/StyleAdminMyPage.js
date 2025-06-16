import styled from "styled-components";
import {Card, CardsWrapper, CTAButton, Section, SectionTitle, Highlight} from "../member/StyleMyPage";

// MyPageContainer는 관리자 페이지에서도 전체 레이아웃을 잡는 데 유용하므로 재사용합니다.
export const AdminPageContainer = styled.div`
    display: flex;
    width: 100%;
    min-height: 80vh;
    border: 1px solid #e0e0e0; /* 관리자 페이지는 좀 더 차분한 테두리 */

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

// MyPageContentArea는 관리자 페이지에서도 메인 콘텐츠 영역을 나타내므로 재사용합니다.
export const AdminContentArea = styled.div`
    flex: 1;
    background-color: #f8f9fa; /* 관리자 페이지의 배경색을 좀 더 밝고 차분하게 */
    padding: 1.5rem; /* 패딩을 약간 늘려 여백 확보 */
    border: 1px solid #ced4da; /* 테두리 색상도 차분하게 변경 */
`;

// 기존 Section을 확장하여 관리자 페이지에 맞는 배경색, 그림자 등을 추가
export const AdminSection = styled(Section)`
    background-color: #ffffff; /* 섹션 배경색을 흰색으로 설정 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 그림자를 더 강조하여 시각적 구분 */
    border: 1px solid #dee2e6; /* 테두리 색상도 차분하게 변경 */
    border-radius: 8px; /* 모서리를 둥글게 처리 */
    padding: 2rem; /* 패딩을 더 넓게 설정하여 정보 밀집도 조절 */
    margin-bottom: 2.5rem; /* 섹션 간 간격 증가 */
`;

// 기존 Card를 확장하여 관리자 대시보드 카드에 맞는 스타일 적용
export const AdminCard = styled(Card)`
    background-color: #ffffff; /* 카드 배경색은 흰색 유지 */
    border: 1px solid #adb5bd; /* 테두리를 더 명확하고 차분한 색상으로 */
    border-left: 5px solid #28a745; /* 왼쪽 테두리에 강조색 (성공, 중요 정보) */
    border-radius: 6px; /* 모서리 둥글게 */
    padding: 20px;
    margin-bottom: 20px; /* 카드 간 간격 */
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); /* 카드에 은은한 그림자 */
    display: flex; /* 내부 요소 정렬을 위해 flex 사용 */
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start; /* 텍스트는 왼쪽 정렬 */

    // 관리자 카드 내의 텍스트 스타일 조정
    span {
        font-size: 1rem;
        color: #343a40;
        line-height: 1.5;
        margin-bottom: 5px;
    }
`;

// CardsWrapper도 관리자 페이지에 맞게 조정 (그리드 레이아웃에 유용)
export const AdminCardsWrapper = styled(CardsWrapper)`
    border: none; /* CardsWrapper의 테두리 제거 */
    padding: 0; /* 패딩 제거 또는 조정 */
    display: grid; /* Flex 대신 Grid를 사용하여 더 유연한 레이아웃 */
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* 반응형 그리드 */
    gap: 20px; /* 카드 간 간격 */

    ${AdminCard} {
        min-width: unset; /* Grid에서는 min-width 설정을 하지 않아도 됨 */
        flex: unset; /* Flex 속성도 unset */
    }
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr; /* 모바일에서는 한 줄로 */
        gap: 15px;
    }
`;


// SectionTitle은 관리자 페이지에서도 명확해야 하므로 거의 유사하게 가져가되, 색상 변경
export const AdminSectionTitle = styled(SectionTitle)`
  color: #343a40; /* 제목 색상을 어둡게 */
  border-bottom: 2px solid #6c757d; /* 하단 경계선 추가 */
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
`;

// Highlight는 중요 정보 강조에 사용되므로 색상 변경
export const AdminHighlight = styled(Highlight)`
  color: #007bff; /* 관리자 페이지의 강조색을 파란색 계열로 */
`;

// CTAButton도 관리자 페이지 테마에 맞게 색상 변경
export const AdminCTAButton = styled(CTAButton)`
  background-color: #007bff; /* 파란색 계열 버튼 */
  &:hover {
    background-color: #0056b3;
  }
`;

// 관리자 사이드바는 기존 Sidebar와 SidebarItem 스타일을 그대로 사용하되,
// AdminMyPageSidebar 컴포넌트에서 내부 메뉴만 다르게 구성합니다.
// 즉, 이 파일에서는 별도의 스타일 정의가 필요 없습니다.
// export { Sidebar, SidebarItem };

// 테이블과 같은 관리자 전용 UI 요소 추가 (예시)
export const AdminTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    font-size: 0.9rem;

    th, td {
        border: 1px solid #e9ecef;
        padding: 12px 15px;
        text-align: left;
    }

    th {
        background-color: #e9ecef;
        font-weight: bold;
        color: #495057;
    }

    tr:nth-child(even) {
        background-color: #f8f9fa;
    }

    tr:hover {
        background-color: #e2e6ea;
    }
`;

export const AdminActionButton = styled.button`
    padding: 8px 12px;
    margin-right: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.2s ease;

    &.primary {
        background-color: #007bff;
        color: white;
        &:hover {
            background-color: #0056b3;
        }
    }

    &.danger {
        background-color: #dc3545;
        color: white;
        &:hover {
            background-color: #c82333;
        }
    }
`;