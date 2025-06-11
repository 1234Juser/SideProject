import styled from 'styled-components';

export const MainWrapper = styled.div`
  font-family: 'Pretendard', sans-serif;
  background-color: #fff;
  color: #333;
  text-align: center;
`;

export const MainTitle = styled.h2`
    font-family: 'Cafe24ClassicType', sans-serif;
    font-size: 32px;
    text-align: center;
    letter-spacing: 4px;
    transform: rotate(-1deg);
    margin-bottom: 8px;
    background: linear-gradient(90deg, #d96e6e, #f3a683);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media (max-width: 768px) {
        font-size: 24px;
        letter-spacing: 2px;
    }
`;

export const MainSubtitle = styled.p`
  font-size: 14px;
  margin: 12px 0;
  color: #777;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

export const ViewMoreButton = styled.button`
  margin: 20px auto 40px;
  border: 1px solid #ff9f9f;
  color: #ff6d6d;
  background: transparent;
  border-radius: 25px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;

  @media (min-width: 768px) {
    font-size: 16px;
    padding: 10px 20px;
  }
`;

export const BestMenuTitle = styled.h2`
  font-size: 28px; /* 예시: MainTitle보다 작게, MainSubtitle보다 크게 */
  font-weight: bold;
  color: #333; /* 적절한 색상 */
  text-align: center;
  margin-top: 40px; /* 위쪽 여백 */
  margin-bottom: 20px; /* 아래쪽 여백 */

  @media (max-width: 768px) {
    font-size: 22px;
    margin-top: 30px;
    margin-bottom: 15px;
  }
`;



export const MenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 20px 60px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 0 40px 80px;
    gap: 24px;
  }
`;

export const MenuItem = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;