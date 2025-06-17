import styled from 'styled-components';

export const InquiryContainer = styled.div`
    width: 90%;
    max-width: 1000px;
    margin: 40px auto;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Title = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 2em;
    font-weight: 600;
`;

export const InquiryTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden; /* Ensures rounded corners apply to table content */
`;

export const TableHeader = styled.th`
    background-color: #f2f2f2;
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    color: #555;
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
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
    &:hover {
        background-color: #f0f0f0;
        /* cursor: pointer; */ /* 문의 상세 페이지가 있다면 커서 변경 */
    }
    &:last-child {
        border-bottom: none;
    }
`;

export const TableCell = styled.td`
    padding: 12px 15px;
    color: #333;
    font-size: 0.95em;
    vertical-align: middle;
`;

export const StatusBadge = styled.span`
    display: inline-block;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.8em;
    font-weight: 600;
    color: white;
    background-color: ${props => {
    switch (props.status) {
        case 'PENDING':
            return '#ffc107'; // Yellow
        case 'ANSWERED':
            return '#28a745'; // Green
        case 'CLOSED':
            return '#6c757d'; // Grey
        default:
            return '#007bff'; // Blue
    }
}};
`;

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    gap: 8px;
`;

export const PageButton = styled.button`
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: ${props => (props.active ? '#007bff' : '#ffffff')};
    color: ${props => (props.active ? '#ffffff' : '#007bff')};
    cursor: pointer;
    font-size: 1em;
    transition: all 0.3s ease;
    &:hover:not(:disabled) {
        background-color: ${props => (props.active ? '#0056b3' : '#e9ecef')};
        color: ${props => (props.active ? '#ffffff' : '#0056b3')};
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

export const InfoText = styled.p`
    text-align: center;
    color: #666;
    margin-top: 30px;
    font-size: 1.1em;
`;

export const Checkbox = styled.input`
    margin-right: 8px;
    width: 18px;
    height: 18px;
    cursor: pointer;
`;

// 메시지 표시를 위한 스타일 (성공/오류)
export const Message = styled.div`
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  font-size: 0.9em;
  text-align: center;
  ${props => props.type === 'error' && `
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  `}
  ${props => props.type === 'success' && `
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  `}
`;


// 문의 종료 버튼 스타일
export const CloseButton = styled.button`
    padding: 10px 15px;
    background-color: #dc3545; /* Red color for close */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 20px;
    margin-bottom: 20px; /* Pagination과의 간격 */
    &:hover {
        background-color: #c82333;
    }
    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;
