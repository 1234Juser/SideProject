import styled from 'styled-components';

export const AdminPaymentContainer = styled.div`
    padding: 20px;
    max-width: 1000px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', sans-serif;
`;

export const AdminPaymentHeader = styled.h1`
    font-size: 2.2em;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 700;
`;

export const DatePickerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    gap: 15px;

    label {
        font-size: 1.1em;
        font-weight: 600;
        color: #555;
    }

    input[type="date"] {
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1em;
        cursor: pointer;
        transition: border-color 0.3s ease;

        &:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }
    }
`;

export const SectionTitle = styled.h2`
    font-size: 1.8em;
    color: #444;
    margin-top: 40px;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
`;

export const ProductList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
`;

export const ProductItem = styled.li`
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 15px;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
`;

export const ProductImage = styled.img`
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid #eee;
`;

export const ProductInfo = styled.div`
    flex-grow: 1;
`;

export const ProductName = styled.p`
    font-size: 1.2em;
    font-weight: 600;
    color: #333;
    margin: 0 0 5px 0;
`;

export const ProductTotalSales = styled.p`
    font-size: 1em;
    color: #666;
    margin: 0;
`;

export const UserPaymentTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fcfcfc;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden; /* Ensures rounded corners apply to table content */

    th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        background-color: #e9ecef;
        color: #333;
        font-weight: 600;
        font-size: 0.95em;
        text-transform: uppercase;
    }

    tr:last-child td {
        border-bottom: none;
    }

    tbody tr:hover {
        background-color: #f1f1f1;
    }
`;

export const NoDataMessage = styled.p`
    text-align: center;
    color: #888;
    font-size: 1.1em;
    padding: 30px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    margin-top: 20px;
`;

export const ErrorMessage = styled.p`
    color: #dc3545;
    text-align: center;
    margin-top: 20px;
    font-size: 1.1em;
    font-weight: 500;
`;
