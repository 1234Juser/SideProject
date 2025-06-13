package com.nowpick.backend.member.domain;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberEntity {
    
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    
    @Column(name = "member_username", nullable = false, unique = true, length = 50)
    private String memberUsername;
    
    @Column (name = "member_password", nullable = false, length = 255)
    private String memberPassword;
    
    @Column(name = "member_email", nullable = false, unique = true, length = 100)
    private String memberEmail;
    
    @Column(name = "member_nickname", nullable = false, length = 50)
    private String memberNickname;
    
    @Column(name = "member_phone_number", nullable = false, length = 20)
    private String memberPhoneNumber;
    
    @Column(name = "member_role", nullable = false, length = 20)
    private String memberRole; // 사용자 권한 (예: USER, ADMIN). enum으로 관리하는 것도 좋은 방법입니다.
    
    @CreationTimestamp // 엔티티가 처음 저장될 때 현재 시간을 자동으로 설정합니다.
    @Column(name = "member_created_at", nullable = false, updatable = false)
    private LocalDateTime memberCreatedAt;
    
    @UpdateTimestamp
    @Column(name = "member_updated_at")
    private LocalDateTime memberUpdatedAt;
    
    @Column(name = "member_is_active", nullable = false)
    private boolean memberIsActive = true;
    
}
