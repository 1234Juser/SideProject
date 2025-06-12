import styled, { css } from 'styled-components';

export const NavWrapper = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 20px 0;
    background-color: #f8f9fa; /* Softer background color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow instead of border */
`;

const menuItemStyles = css`
    position: relative;
    text-decoration: none;
    color: #495057; /* Slightly softer text color */
    font-weight: 600;
    padding: 10px 4px;
    border-radius: 6px;
    transition: color 0.3s ease;
    cursor: pointer;
    background: none; /* Remove background for underline effect */

    &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #0d6efd; /* A nice blue for accent */
        transition: width 0.3s ease;
    }

    &:hover {
        color: #0d6efd; /* Match accent color on hover */
    }

    &:hover::after {
        width: 100%;
    }
`;

export const CenterMenu = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 30px; /* Increased gap for more space */
    flex-shrink: 0;

    a {
        ${menuItemStyles}
    }

    @media (max-width: 768px) {
        gap: 20px;
        font-size: 14px;
        a, > div > div { /* Target MenuDropdown more specifically */
            padding: 6px 10px;
        }
    }
`;

export const MenuDropdownContainer = styled.div`
    position: relative;
    display: inline-block;
`;

export const MenuDropdown = styled.div`
    ${menuItemStyles}
    user-select: none;
`;

export const DropdownContent = styled.div`
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    display: flex;
    flex-direction: column;
    border: none; /* Remove border for a cleaner look */
    border-radius: 8px; /* Softer radius */
    padding: 8px;
    min-width: 140px; /* A bit wider */
    z-index: 10;
    margin-top: 15px; /* More space from the parent */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* Nicer shadow */
    opacity: 0;
    visibility: hidden;
    transform: translate(-50%, 10px); /* Start slightly lower for animation */
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;

    ${MenuDropdownContainer}:hover & {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%);
    }

    a {
        padding: 10px 15px;
        text-decoration: none;
        color: #495057;
        text-align: center;
        border-radius: 6px;
        transition: background-color 0.2s ease, color 0.2s ease;

        &:hover {
            background-color: #e9ecef;
            color: #0d6efd;
        }
    }
`;