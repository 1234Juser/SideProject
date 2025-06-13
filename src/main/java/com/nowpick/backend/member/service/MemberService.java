package com.nowpick.backend.member.service;


import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.dto.MemberResponseDTO;
import com.nowpick.backend.member.dto.MemberSignupRequestDTO;
import com.nowpick.backend.member.repo.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MemberService {
    
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    
    
    // 회원 가입
    public MemberResponseDTO signup( MemberSignupRequestDTO requestDTO) {
       
        // 1. 사용자명 중복 확인
        if (memberRepository.existsByMemberUsername(requestDTO.getMemberUsername())) {
            log.warn("Attempted signup with existing username: {}", requestDTO.getMemberUsername());
            throw new IllegalArgumentException("이미 사용 중인 사용자명입니다.");
        }
        
        // 2. 이메일 중복 확인
        if (memberRepository.existsByMemberEmail (requestDTO.getMemberEmail())) {
            log.warn("Attempted signup with existing email: {}", requestDTO.getMemberEmail());
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        
        // 3. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(requestDTO.getMemberPassword());
        
        // 4. MemberEntity 객체 생성 및 기본값 설정
        MemberEntity newMember = MemberEntity.builder()
                                 .memberUsername(requestDTO.getMemberUsername())
                                 .memberPassword(encodedPassword) // 암호화된 비밀번호 저장
                                 .memberEmail(requestDTO.getMemberEmail())
                                 .memberNickname(requestDTO.getMemberNickname())
                                 .memberPhoneNumber(requestDTO.getMemberPhoneNumber())
                                 .memberRole("ROLE_USER")
                                 .memberIsActive(true)
                                 .build();
        
        // 5. 데이터베이스에 저장
        MemberEntity savedMember = memberRepository.save(newMember);
        
        // 6. 응답 DTO로 변환하여 반환
        return new MemberResponseDTO(savedMember);

    }
}
