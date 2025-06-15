import styled from 'styled-components'

export const MyPageContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 80vh;
    border: 1px solid black;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const MyPageContentArea = styled.div`
    flex: 1;
    background-color: white;
    padding: 1rem;
    border: 2px solid blueviolet;
`;

export const Section = styled.section`
    margin-bottom: 2rem;
    background-color: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    border: 1px solid #ff0000;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    
    
    & > div {
        flex: 1;
        min-width: 300px;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        & > div {
            width: 100%;
        }
    }
    
`;

export const Card = styled.div`
    background-color: #f8f8f8;
    padding: 24px;
    margin-bottom: 16px;
    border: 1px solid #000000;
`;


export const CardsWrapper = styled.div`
    border: 2px solid pink;
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    
    ${Card} {
        flex: 1;
        min-width: 300px;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        ${Card} {
            width: 100%;
        }
    }
`;


export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
    border: 1px solid black;
`;



export const OrderBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 1rem;
  border: 1px solid #ddd;
`;

export const InfoItem = styled.p`
  margin: 0.3rem 0;
`;

export const CouponBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1rem;
  border: 1px solid #ddd;
`;

export const ReviewItem = styled.li`
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #eee;
  background-color: #fff;
`;

export const Button = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #ff7f50;
  color: #fff;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #ff5722;
  }
`;

export const CTAButton = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  background-color: #222;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-top: 12px;
`;

export const Highlight = styled.span`
  color: #d2691e;
  font-weight: bold;
`;