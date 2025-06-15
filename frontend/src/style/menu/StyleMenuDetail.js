import styled from 'styled-components';

export const MenuDetailContainer = styled.div`
  display: flex;
  padding: 20px;
`;

export const MenuImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 30px;
`;

export const MenuInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MenuName = styled.h2`
  font-size: 24px;
`;

export const MenuDescription = styled.p`
  font-size: 16px;
  color: #666;
`;

export const MenuPrice = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

export const MenuOptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const MenuLabel = styled.label`
  font-weight: 500;
`;

export const MenuRadioGroup = styled.div`
  display: flex;
  gap: 20px;
`;

export const MenuSelect = styled.select`
  padding: 6px 10px;
  font-size: 16px;
`;

export const OrderButton = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #ff6f0f;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #e65c00;
  }
`;