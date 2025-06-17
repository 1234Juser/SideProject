import styled from 'styled-components';

export const ChatListContainer = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
    font-size: 28px;
    color: #333;
    margin-bottom: 25px;
    text-align: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
`;

export const ChatTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden; /* For rounded corners */
`;

export const TableHeader = styled.th`
    background-color: #007bff;
    color: white;
    padding: 15px 10px;
    text-align: left;
    font-weight: bold;
    font-size: 16px;
    border-bottom: 1px solid #ddd;

    &:first-child {
        border-top-left-radius: 8px;
    }
    &:last-child {
        border-top-right-radius: 8px;
    }
`;

export const TableRow = styled.tr`
    border-bottom: 1px solid #eee;
    cursor: pointer; /* To indicate clickable rows */

    &:hover {
        background-color: #f1f1f1;
    }

    &:last-child {
        border-bottom: none;
    }
`;

export const TableCell = styled.td`
    padding: 12px 10px;
    vertical-align: middle;
    font-size: 15px;
    color: #555;
`;

export const StatusBadge = styled.span`
    display: inline-block;
    padding: 5px 10px;
    border-radius: 15px;
    font-weight: bold;
    font-size: 13px;
    color: white;
    background-color: ${props => {
        switch (props.$status) {
            case 'OPEN':
                return '#28a745'; // Green
            case 'CLOSED':
                return '#dc3545'; // Red
            default:
                return '#6c757d'; // Grey
        }
    }};
`;

export const Checkbox = styled.input`
    margin-right: 5px;
    width: 18px;
    height: 18px;
    cursor: pointer;
`;

export const ActionButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 10px;
`;

export const ActionButton = styled.button` /* CloseButton을 ActionButton으로 변경 */
    background-color: #dc3545; /* Red for closing */
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c82333;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

export const InfoText = styled.p`
    text-align: center;
    font-size: 16px;
    color: #777;
    margin-top: 20px;
`;

export const Message = styled.div`
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    font-size: 15px;
    text-align: center;

    &.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    &.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
`;