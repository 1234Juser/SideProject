import styled from 'styled-components';

export const DetailContainer = styled.div`
    padding: 30px;
    max-width: 900px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #333;
`;

export const Title = styled.h2`
    color: #2c3e50;
    text-align: center;
    margin-bottom: 35px;
    font-size: 2.5em;
    font-weight: 700;
    position: relative;
    padding-bottom: 15px;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 4px;
        background-color: #3498db;
        border-radius: 2px;
    }
`;

export const Section = styled.div`
    margin-bottom: 30px;
    padding: 25px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background-color: #fcfcfc;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        border-color: #c9e6f9;
    }
`;

export const SectionTitle = styled.h3`
    color: #34495e;
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.6em;
    font-weight: 600;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 10px;
    display: flex;
    align-items: center;

    &::before {
        content: '•';
        color: #3498db;
        font-size: 1.2em;
        margin-right: 8px;
    }
`;

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding: 5px 0;
    border-bottom: 1px dashed #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
`;

export const Label = styled.span`
    font-weight: 500;
    color: #555;
    min-width: 90px;
    flex-shrink: 0;
    margin-right: 15px;
`;

export const Value = styled.span`
    color: #333;
    font-size: 1em;
    word-break: break-word; /* 긴 단어가 영역을 벗어나지 않도록 */
`;

export const ContentText = styled.p`
    white-space: pre-wrap;
    line-height: 1.7;
    color: #444;
    font-size: 1.1em;
    background-color: #fcfcfc;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #eee;
    margin-top: 15px;
`;

export const StatusBadge = styled.span`
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9em;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background-color: ${(props) => {
    switch (props.status) {
        case 'PENDING':
            return '#f39c12'; // Orange
        case 'REPLIED':
            return '#27ae60'; // Emerald Green
        case 'CLOSED':
            return '#7f8c8d'; // Asbestos Gray
        default:
            return '#3498db'; // Peter River Blue
    }
}};
`;

export const Message = styled.div`
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    font-size: 1.1em;
    color: ${(props) => (props.type === 'error' ? '#c0392b' : '#27ae60')};
    background-color: ${(props) => (props.type === 'error' ? '#fde7e7' : '#e6f7ed')};
    border: 1px solid ${(props) => (props.type === 'error' ? '#ebc2c2' : '#b2e2cd')};
`;