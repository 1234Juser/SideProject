import styled from 'styled-components';

export const DetailContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 30px auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
    color: #333;
    text-align: center;
    margin-bottom: 25px;
    font-size: 2em;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
`;

export const Section = styled.div`
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
`;

export const InquiryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

export const InquiryTitle = styled.h3`
    color: #007bff;
    font-size: 1.8em;
    margin: 0;
`;

export const InquiryMeta = styled.p`
    color: #666;
    font-size: 0.9em;
    margin-bottom: 15px;
`;

export const InquiryContent = styled.p`
    color: #333;
    line-height: 1.6;
    white-space: pre-wrap; /* Preserve whitespace and line breaks */
    font-size: 1.1em;
    margin-bottom: 0;
`;

export const StatusBadge = styled.span`
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 0.85em;
    color: white;
    background-color: ${props => {
        switch (props.status) {
            case 'PENDING': return '#ffc107'; // Yellow
            case 'ANSWERED': return '#28a745'; // Green
            case 'CLOSED': return '#6c757d'; // Gray
            default: return '#007bff';
        }
    }};
`;

export const ReplyTitle = styled.h4`
    color: #333;
    font-size: 1.5em;
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
`;

export const ExistingReply = styled.div`
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
    margin-top: 15px;
`;

export const ReplyMeta = styled.p`
    color: #666;
    font-size: 0.9em;
    margin-bottom: 10px;
`;

export const ReplyForm = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 15px;
`;

export const ReplyTextArea = styled.textarea`
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    resize: vertical;
    min-height: 100px;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
`;

export const ReplySubmitButton = styled.button`
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

export const ReplyActionButton = styled.button`
    padding: 10px 15px;
    background-color: #dc3545; /* Red for delete */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    margin-left: 10px; /* Spacing from submit button */

    &:hover {
        background-color: #c82333;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

export const InfoText = styled.p`
    color: #0056b3;
    text-align: center;
    font-style: italic;
    margin-top: 20px;
`;

export const ErrorText = styled.p`
    color: #dc3545;
    text-align: center;
    font-weight: bold;
    margin-top: 20px;
`;

export const SuccessText = styled.p`
    color: #28a745;
    text-align: center;
    font-weight: bold;
    margin-top: 20px;
`;