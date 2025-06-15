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