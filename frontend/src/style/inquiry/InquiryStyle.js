import styled from 'styled-components';

export const InquiryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 150px); // Adjust based on your header/footer height
`;

export const InquiryForm = styled.form`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
`;

export const FormTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #555;
  font-size: 16px;
`;

export const StyledInput = styled.input`
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #E64A58;
  }
`;

export const StyledTextarea = styled.textarea`
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-height: 250px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #E64A58;
  }
`;

export const SubmitButton = styled.button`
  padding: 15px;
  border: none;
  border-radius: 8px;
  background-color: #E64A58;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #D03D4A;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const Message = styled.p`
  text-align: center;
  font-size: 15px;
  padding: 12px;
  border-radius: 6px;
  color: white;
  background-color: ${props => props.type === 'error' ? '#d9534f' : '#5cb85c'};
`;