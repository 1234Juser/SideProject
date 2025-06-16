import styled from "styled-components";

export const Sidebar = styled.div`
    width: 20%;
    //background-color: #f1f1f1;
    padding: 1rem;
    border-top: 2px solid #5b5b5b;
    margin-right: 1.5rem;

    @media (max-width: 768px) {
        width: 100%;
        margin-right: 0;
        margin-bottom: 1rem;
    }
`;

export const SidebarItem = styled.div`
    padding: 1rem;
    margin-bottom: 1rem;
    font-weight: ${({isActive}) => (isActive ? 'bold' : 'normal')};
    color: ${({isActive}) => (isActive ? '#4f46e5' : '#333')};
    cursor: pointer;
    border-left: ${({isActive}) => (isActive ? '4px solid #4f46e5' : '4px solid transparent')};
    border-bottom: 1px solid #c2c2c2;

    &:hover {
        background-color: #f0f0f0;
    }
`;

// 드롭다운 아이템을 위한 새로운 스타일 컴포넌트 추가
export const DropdownItem = styled(SidebarItem)`
    padding-left: 2.5rem; /* 서브 메뉴처럼 보이도록 들여쓰기 */
    font-size: 0.95rem; /* 글씨 크기 약간 줄이기 */
    margin-bottom: 0.5rem; /* 하단 마진 줄이기 */
    border-left: 4px solid transparent; /* 기본 보더 제거 또는 변경 */
    &:hover {
        background-color: #e0e0e0; /* 호버 시 배경색 변경 */
    }
`;