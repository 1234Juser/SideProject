import styled from 'styled-components';

export const NavWrapper = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 16px 0;
    background-color: #fff;
    border : 1px solid black;
`;

export const CenterMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  flex-shrink: 0;

  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background 0.2s ease;

    &:hover {
      background-color: #ffecec;
    }
  }

  @media (max-width: 480px) {
    gap: 12px;
    font-size: 14px;
    a {
      padding: 6px 10px;
    }
  }
`;