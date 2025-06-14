package com.nowpick.backend.member.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class LoginRequestDTO {
    
    private String memberUsername;
    private String memberPassword;
    
}
