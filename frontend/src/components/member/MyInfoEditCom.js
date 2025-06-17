import { SectionTitle,} from "../../style/member/StyleMyPage";
import {
    CheckboxGroup,
    ErrorText,
    FormContainer,
    FormGroup,
    Input,
    Label,
    SuccessText, EditButton
} from "../../style/member/StyleMyInfoEdit";
import React from "react";


function MyInfoEditCom({handleChange, handleSubmit, formData, formErrors, loading, error, successMessage,
                           changePassword}) {


    return (
        <>
                <SectionTitle>내 정보 수정</SectionTitle>
                <FormContainer>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="memberNickname">닉네임</Label>
                            <Input
                                type="text"
                                id="memberNickname"
                                name="memberNickname"
                                value={formData.memberNickname}
                                onChange={handleChange}
                                placeholder="닉네임을 입력하세요"
                            />
                            {formErrors.memberNickname && <ErrorText>{formErrors.memberNickname}</ErrorText>}
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="memberPhoneNumber">전화번호</Label>
                            <Input
                                type="tel" // tel 타입으로 변경
                                id="memberPhoneNumber"
                                name="memberPhoneNumber"
                                value={formData.memberPhoneNumber}
                                onChange={handleChange}
                                placeholder="010-1234-5678"
                            />
                            {formErrors.memberPhoneNumber && <ErrorText>{formErrors.memberPhoneNumber}</ErrorText>}
                        </FormGroup>

                        <CheckboxGroup>
                            {/*<Input*/}
                            {/*    type="checkbox"*/}
                            {/*    id="changePassword"*/}
                            {/*    checked={changePassword}*/}
                            {/*    onChange={handleCheckboxChange}*/}
                            {/*/>*/}
                            {/*<Label htmlFor="changePassword">비밀번호 변경</Label>*/}
                        {/*    ---------- 체크박스 나중에 재활용 하기 ----------*/}
                        </CheckboxGroup>

                                <FormGroup>
                                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                                    <Input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="현재 비밀번호를 입력하세요"
                                    />
                                    {formErrors.currentPassword && <ErrorText>{formErrors.currentPassword}</ErrorText>}
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor="newPassword">새 비밀번호</Label>
                                    <Input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="새 비밀번호 (8자 이상)"
                                    />
                                    {formErrors.newPassword && <ErrorText>{formErrors.newPassword}</ErrorText>}
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
                                    <Input
                                        type="password"
                                        id="confirmNewPassword"
                                        name="confirmNewPassword"
                                        value={formData.confirmNewPassword}
                                        onChange={handleChange}
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                    />
                                    {formErrors.confirmNewPassword && <ErrorText>{formErrors.confirmNewPassword}</ErrorText>}
                                </FormGroup>

                        {error && <ErrorText>{error}</ErrorText>}
                        {successMessage && <SuccessText>{successMessage}</SuccessText>}

                        <div>
                            <span>회원 탈퇴</span>
                        </div>

                        <EditButton type="submit" disabled={loading}>
                            {loading ? '저장 중...' : '정보 수정'}
                        </EditButton>
                    </form>
                </FormContainer>
        </>
    );
}

export default MyInfoEditCom;
