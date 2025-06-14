package com.nowpick.backend.member.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MemberSignupRequestDTO {
    
    private String memberUsername;
    private String memberPassword;
    private String memberEmail;
    private String memberNickname;
    private String memberPhoneNumber;
    // member_role, created_at, updated_at, is_active, last_login_at, profile_image_url
    // 등은 요청 시 받지 않고, 서비스 계층에서 기본값을 설정하거나 비즈니스 로직에 따라 처리합니다.
    
}
