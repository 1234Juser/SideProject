package com.nowpick.backend.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class LoginResponseDTO {
    
    private String accessToken;
    private String memberUsername;
    private String memberRole;
    private String memberNickname;
    
}
