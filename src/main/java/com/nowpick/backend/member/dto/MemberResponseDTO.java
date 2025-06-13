package com.nowpick.backend.member.dto;


import com.nowpick.backend.member.domain.MemberEntity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MemberResponseDTO {
    
    private Long memberId;
    private String memberUsername;
    private String memberEmail;
    private String memberNickname;
    private String memberPhoneNumber;
    private String memberRole;
    private LocalDateTime memberCreatedAt;
    private LocalDateTime memberUpdatedAt;
    private boolean memberIsActive;
    
    
    public MemberResponseDTO(MemberEntity memberEntity) {
        this.memberId = memberEntity.getMemberId ();
        this.memberUsername = memberEntity.getMemberUsername ();
        this.memberEmail = memberEntity.getMemberEmail ();
        this.memberNickname = memberEntity.getMemberNickname ();
        this.memberPhoneNumber = memberEntity.getMemberPhoneNumber ();
        this.memberRole = memberEntity.getMemberRole ();
        this.memberCreatedAt = memberEntity.getMemberCreatedAt ();
        this.memberUpdatedAt = memberEntity.getMemberCreatedAt ();
        this.memberIsActive = memberEntity.isMemberIsActive ();
    }
}
