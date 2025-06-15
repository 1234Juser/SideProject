import styled from 'styled-components';

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 85vh; /* 높이 약간 조정 */
  min-height: 600px; /* 최소 높이 추가: 채팅방이 너무 작아지지 않도록 */
  width: 100%;
  max-width: 800px;
  margin: 30px auto; /* 마진 조정 */
  border: 1px solid #e0e0e0; /* 옅은 테두리 */
  border-radius: 12px; /* 더 둥근 모서리 */
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); /* 더 은은하고 깊이 있는 그림자 */
  background-color: #ffffff;
`;

export const ChatHeader = styled.div`
  background: #f0f2f5; /* MessageContainer와 동일한 색상 */
  color: #333; /* 텍스트 색상을 어둡게 조정 */
  padding: 15px 20px;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #eee; /* 옅은 테두리 */
  position: relative; /* 자식 요소의 절대 위치 지정을 위해 추가 */
`;

export const MessageContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5; /* 더 부드러운 배경색 */
  display: flex;
  flex-direction: column;
  gap: 15px; /* 메시지 간격 넓힘 */
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #c4c4c4;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;

export const MessageBubble = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isUser'].includes(prop)
})`
  max-width: 75%; /* 메시지 버블 너비 약간 넓힘 */
  padding: 12px 18px; /* 패딩 조정 */
  border-radius: 20px; /* 더 둥근 모서리 */
  color: #333;
  line-height: 1.5; /* 줄 간격 조정 */
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isUser ? '#dcf8c6' : '#ffffff'}; /* 사용자 메시지 배경색 유지, 상대방 메시지 흰색 */
  border: ${props => props.isUser ? 'none' : '1px solid #e0e0e0'}; /* 상대방 메시지 테두리 추가 */
  box-shadow: 0 2px 5px rgba(0,0,0,0.08); /* 더 부드러운 그림자 */
  transition: all 0.2s ease-in-out; /* 부드러운 전환 효과 */

  ${props => props.isUser && `
    background-color: #26a69a; /* 사용자 메시지: 세련된 청록색 */
    color: white;
    border-bottom-right-radius: 5px; /* 한쪽 모서리 덜 둥글게 */
  `}

  ${props => !props.isUser && `
    background-color: #ffffff; /* 상대방 메시지: 흰색 배경 */
    color: #333;
    border: 1px solid #e0e0e0;
    border-bottom-left-radius: 5px; /* 한쪽 모서리 덜 둥글게 */
  `}

  p {
    margin: 0; /* 단락 마진 제거 */
  }
  .message-content {
    white-space: pre-wrap; /* 이 줄을 추가하여 줄바꿈을 유지합니다. */
    word-break: break-word; /* 긴 단어가 줄바꿈되도록 */
  }
`;

export const MessageMeta = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isUser'].includes(prop)
})`
  font-size: 0.75em; /* 글씨 크기 약간 줄임 */
  color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.7)' : '#999'}; /* 메타데이터 색상 조정 */
  margin-top: 5px;
  text-align: ${props => props.isUser ? 'right' : 'left'};
  font-weight: bold; /* 닉네임을 진하게 표시 */
`;

export const ChatForm = styled.form`
  display: flex;
  padding: 15px 20px; /* 패딩 조정 */
  border-top: 1px solid #eee; /* 옅은 테두리 */
  background-color: #ffffff;
  gap: 10px; /* 입력창과 버튼 사이 간격 */
`;

export const ChatInput = styled.textarea`
  flex-grow: 1; /* 가용한 공간을 모두 차지하도록 변경 */
  height: auto; /* 내용에 따라 높이가 늘어나도록 */
  min-height: 40px; /* 최소 높이 설정 */
  max-height: 120px; /* 최대 높이 설정 (스크롤 생김) */
  resize: none; /* 사용자 임의의 크기 조절 방지 (선택 사항) */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  overflow-y: auto; /* 내용이 많아지면 스크롤바 표시 */

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 12px 22px; /* 패딩 조정 */
  background: linear-gradient(to right, #2575fc 0%, #6a11cb 100%); /* 그라데이션 버튼 */
  color: white;
  border: none;
  border-radius: 25px; /* 더 둥근 모서리 */
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

export const StatusMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
  color: #555;
  &.error {
    color: #d9534f;
  }
`;

export const EndChatButton = styled.button`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #f44336; /* 빨간색 계열 */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background-color: #d32f2f;
  }
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;