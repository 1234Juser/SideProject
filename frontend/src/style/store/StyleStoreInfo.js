import styled from 'styled-components';

// 정보창의 전체를 감싸는 컨테이너
export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 40px; /* 마커 바로 위에 위치하도록 조정 */
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
    z-index: 1;

  /* 말풍선 꼬리 */
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: white;
    border-bottom: 0;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

export const StoreImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

export const ContentWrapper = styled.div`
  padding: 16px;
`;

export const StoreTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #222;
`;

export const StoreAddress = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
`;

export const StoreText = styled.p`
    font-size: 14px;
    color: black;
    margin: 0 0 5px 0;
`;

export const LinkButton = styled.a`
  display: block;
  padding: 10px;
  text-align: center;
  background-color: #FFDC00; /* 카카오 색상 */
  color: #391B1B;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #F7D000;
  }
`;