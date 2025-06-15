import React from 'react';
import {
    InquiryWrapper,
    InquiryForm,
    FormTitle,
    InputGroup,
    Label,
    StyledInput,
    StyledTextarea,
    SubmitButton,
    Message
} from '../../style/inquiry/InquiryStyle';


function InquiryCom({
                        title,
                        content,
                        error,
                        success,
                        isLoading,
                        isFormDisabled,
                        setTitle,
                        setContent,
                        handleSubmit
                    }) {
    return (
        <InquiryWrapper>
            <InquiryForm onSubmit={handleSubmit}>
                <FormTitle>1:1 문의하기</FormTitle>
                {error && <Message type="error">{error}</Message>}
                {success && <Message type="success">{success}</Message>}
                <InputGroup>
                    <Label htmlFor="title">제목</Label>
                    <StyledInput
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="문의 제목을 입력하세요."
                        required
                        disabled={isFormDisabled}
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="content">내용</Label>
                    <StyledTextarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="문의하실 내용을 상세하게 입력해주세요."
                        required
                        disabled={isFormDisabled}
                    />
                </InputGroup>
                <SubmitButton type="submit" disabled={isFormDisabled}>
                    {isLoading ? '등록 중...' : '문의 등록'}
                </SubmitButton>
            </InquiryForm>
        </InquiryWrapper>
    );
}

export default InquiryCom;