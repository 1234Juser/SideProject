package com.nowpick.backend.member.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class MemberUpdateRequestDTO {
    
    private String memberEmail;
    private String memberNickname;
    
    @Pattern(regexp = "^(01[016789])-\\d{3,4}-\\d{4}$", message = "유효한 전화번호 형식이 아닙니다 (예: 010-1234-5678).")
    private String memberPhoneNumber;
    
    // 비밀번호 변경 시에만 사용
    private String currentPassword;
    
    @Size(min = 4, max = 20, message = "비밀번호는 4자 이상 20자 이하로 입력해 주세요.")
    private String newPassword;

    // confirmNewPassword는 프론트엔드에서만 검사하고 백엔드로는 보내지 않습니다.
    
}
