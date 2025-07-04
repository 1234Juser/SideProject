import styled from 'styled-components';

export const DetailContainer = styled.div`
    padding: 20px;
    max-width: 900px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', sans-serif;
`;

export const DetailHeader = styled.h1`
    font-size: 2.2em;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 700;
`;

export const ProductSummary = styled.div`
    background-color: #f0f8ff; // Llampu anqas qhipa
    border: 1px solid #cceeff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const ProductImageStyled = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #e0e0e0;
`;

export const ProductInfoStyled = styled.div`
    flex-grow: 1;
`;

export const ProductNameStyled = styled.h2`
    font-size: 1.8em;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 600;
`;

export const ProductStats = styled.p`
    font-size: 1.1em;
    color: #555;
    margin-bottom: 5px;
    strong {
        color: #34495e;
    }
`;

export const SectionTitle = styled.h2`
    font-size: 1.8em;
    color: #333;
    margin-top: 40px;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
    text-align: center;
`;

export const UserPaymentTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fdfdfd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;

    th, td {
        border: 1px solid #e0e0e0;
        padding: 12px 15px;
        text-align: center;
        font-size: 0.95em;
        color: #444;
    }

    th {
        background-color: #f2f2f2;
        font-weight: 600;
        color: #333;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tr:hover {
        background-color: #eef;
    }
`;

export const NoDataMessage = styled.p`
    text-align: center;
    color: #777;
    font-size: 1.1em;
    padding: 30px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-top: 20px;
`;

export const ErrorMessageStyled = styled(NoDataMessage)`
    color: #dc3545;
    background-color: #ffebeb;
    border: 1px solid #dc3545;
`;

export const BackButton = styled.button`
    display: block;
    width: 200px;
    padding: 12px 20px;
    margin: 40px auto 20px auto;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);

    &:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`;
