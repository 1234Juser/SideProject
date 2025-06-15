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
    align-items: center;
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

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownTrigger = styled.div`
  cursor: pointer;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s ease;
  user-select: none; /* Prevents text selection on click */

  &:hover {
    background-color: #ffecec;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 6px 10px;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
  border-radius: 8px;
  padding: 6px;
  margin-top: 8px;
  border: 1px solid #f0f0f0;
`;

export const DropdownItem = styled.div`
  a {
    font-weight: 500;
    color: #333;
    padding: 10px 16px;
    text-decoration: none;
    display: block;
    text-align: center;
    border-radius: 6px;

    &:hover {
      background-color: #ffecec;
    }
  }
`;