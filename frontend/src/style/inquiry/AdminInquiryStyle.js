import styled from 'styled-components';

export const InquiryContainer = styled.div`
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
`;

export const Title = styled.h2`
    color: #333;
    margin-bottom: 20px;
    text-align: center;
`;

export const InquiryTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
`;

export const TableHeader = styled.th`
    background-color: #007bff;
    color: white;
    padding: 12px 15px;
    text-align: left;
    font-weight: bold;
`;

export const TableRow = styled.tr`
    border-bottom: 1px solid #ddd;
    &:nth-child(even) {
        background-color: #f2f2f2;
    }
    &:hover {
        background-color: #e9ecef;
        cursor: pointer;
    }
`;

export const TableCell = styled.td`
    padding: 12px 15px;
    vertical-align: middle;
    color: #555;
`;

export const StatusBadge = styled.span`
    display: inline-block;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.85em;
    font-weight: bold;
    color: white;
    background-color: ${props => {
    switch (props.status) {
        case 'PENDING': return '#ffc107'; // Yellow for pending
        case 'ANSWERED': return '#28a745'; // Green for answered
        case 'CLOSED': return '#6c757d'; // Gray for closed
        default: return '#007bff';
    }
}};
`;

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 10px;
`;

export const PageButton = styled.button`
    background-color: ${props => props.active ? '#007bff' : '#f0f0f0'};
    color: ${props => props.active ? 'white' : '#333'};
    border: 1px solid #ddd;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    &:hover:not(:disabled) {
        background-color: ${props => props.active ? '#0056b3' : '#e0e0e0'};
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

export const InfoText = styled.p`
    text-align: center;
    color: #666;
    margin-top: 20px;
`;

export const InquiryDetailContainer = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    padding: 20px;
    margin-top: 30px;
`;

export const DetailTitle = styled.h3`
    color: #007bff;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
`;

export const DetailItem = styled.p`
    margin-bottom: 8px;
    font-size: 0.95em;
    color: #444;
`;

export const DetailContent = styled.div`
    background-color: #f0f0f0;
    border: 1px solid #e0e0e0;
    padding: 15px;
    border-radius: 5px;
    margin-top: 15px;
    white-space: pre-wrap; /* 공백 및 줄 바꿈 유지 */
    color: #333;
`;

export const ReplySection = styled.div`
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
`;

export const ReplyTitle = styled.h4`
    color: #333;
    margin-bottom: 15px;
`;

export const ReplyContentDisplay = styled.div`
    background-color: #e9f5ff;
    border: 1px solid #b3d7ff;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    white-space: pre-wrap;
    color: #0056b3;
`;

export const ReplyForm = styled.form`
    display: flex;
    flex-direction: column;
`;

export const ReplyTextarea = styled.textarea`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
    min-height: 120px;
    resize: vertical;
    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
`;

export const ReplyButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    &:hover:not(:disabled) {
        background-color: #0056b3;
    }
    &:disabled {
        background-color: #a0c9f1;
        cursor: not-allowed;
    }
`;

export const Label = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
`;

export const Message = styled.p`
    font-size: 0.9em;
    margin-top: -5px;
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 4px;
    ${props => props.type === 'error' && `
        color: #721c24;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
    `}
    ${props => props.type === 'success' && `
        color: #155724;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
    `}
`;

export const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    cursor: pointer;
    margin-right: 8px; /* 체크박스와 내용 사이의 간격 */
`;

export const DeleteButton = styled.button`
    padding: 10px 20px;
    background-color: #dc3545; /* Bootstrap danger color */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
    &:hover {
        background-color: #c82333;
    }
    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
`;
