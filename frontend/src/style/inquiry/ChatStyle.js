import styled from 'styled-components';

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const MessageContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  color: #333;
  line-height: 1.4;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isUser ? '#dcf8c6' : '#ffffff'};
  border: 1px solid ${props => props.isUser ? '#cdeab5' : '#e0e0e0'};
  box-shadow: 0 1px 1px rgba(0,0,0,0.05);

  p {
    margin: 5px 0 0 0;
  }
`;

export const MessageMeta = styled.div`
  font-size: 0.8em;
  color: #666;
  margin-bottom: 5px;

  strong {
    color: #000;
  }
`;

export const ChatForm = styled.form`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #fff;
`;

export const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const SendButton = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
  }
`;

export const StatusMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  color: #666;
`;