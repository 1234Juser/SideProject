import styled from 'styled-components';

export const MenuListContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const MenuListTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const MenuList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

export const MenuCard = styled.div`
  width: 280px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    width: 45%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const MenuImage = styled.img`
  width: 100%;
  height: 300px;
  //object-fit: cover;
  border-radius: 8px;
`;

export const MenuInfo = styled.div`
  margin-top: 1rem;
`;

export const MenuName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.3rem;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const MenuDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MenuPrice = styled.p`
  font-weight: bold;
  margin-top: 0.5rem;
`;

export const MenuCategory = styled.p`
  font-size: 0.85rem;
  color: #444;
  margin-top: 0.3rem;
`;

export const MenuIce = styled.p`
  font-size: 0.85rem;
  color: #888;
`;