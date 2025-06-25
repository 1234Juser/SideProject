import styled from 'styled-components';

export const WishListContainer = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

export const WishListTitle = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 2em;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
`;

export const WishlistGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    justify-content: center;
`;

export const WishlistItem = styled.div`
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
`;

export const WishlistImage = styled.img`
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 15px;
`;

export const WishlistInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 10px;
`;

export const WishlistName = styled.h3`
    font-size: 1.5em;
    color: #444;
    margin-bottom: 8px;
    text-align: left;
    width: 100%;
`;

export const WishlistDescription = styled.p`
    font-size: 0.9em;
    color: #777;
    margin-bottom: 10px;
    line-height: 1.4;
    text-align: left;
    width: 100%;
`;

export const WishlistPrice = styled.p`
    font-size: 1.2em;
    color: #007bff;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: left;
    width: 100%;
`;

export const RemoveButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s ease-in-out;
    width: 100%;

    &:hover {
        background-color: #c82333;
    }
`;