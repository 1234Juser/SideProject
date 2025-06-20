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


// function MyInfoEditCom({handleChange, handleSubmit, formData = {}, formErrors, loading, error, successMessage,
//                            changePassword}) {

    // 모든 props에 기본값을 설정하여, 부모로부터 undefined가 넘어와도 안전하게 처리합니다.
    function MyInfoEditCom({
                               handleChange = () => {}, // 함수 기본값
                               handleSubmit = () => {}, // 함수 기본값
                               formData = {},            // 객체 기본값
                               formErrors = {},          // 객체 기본값
                               loading = false,          // boolean 기본값
                               error = null,             // null 기본값
                               successMessage = null,    // null 기본값
                               // changePassword = false,    // boolean 기본값 (만약 이 prop이 사용된다면)
                               nicknameDuplicateError = null, // 추가된 prop
                               isNicknameAvailable = null,    // 추가된 prop
                           }) {



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
                                value={formData.memberNickname || ''}
                                onChange={handleChange}
                                placeholder="닉네임을 입력하세요"
                            />
                            {formErrors.memberNickname && <ErrorText>{formErrors.memberNickname}</ErrorText>}
                        </FormGroup>


                        {/* 닉네임 중복 검사 결과 메시지 */}
                        {nicknameDuplicateError && <ErrorText>{nicknameDuplicateError}</ErrorText>}
                        {isNicknameAvailable === true && !nicknameDuplicateError && formData.memberNickname && formData.memberNickname.trim().length >= 2 && (
                            <SuccessText>사용 가능한 닉네임입니다.</SuccessText>
                        )}
                        {/* isNicknameAvailable이 null일 때는 아직 검사 전이거나 초기 상태이므로 아무것도 표시하지 않습니다. */}



                        <FormGroup>
                            <Label htmlFor="memberPhoneNumber">전화번호</Label>
                            <Input
                                type="tel"
                                id="memberPhoneNumber"
                                name="memberPhoneNumber"
                                value={formData.memberPhoneNumber || ''}
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
                                        value={formData.currentPassword || ''}
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
                                        value={formData.newPassword || ''}
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
                                        value={formData.confirmNewPassword || ''}
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
