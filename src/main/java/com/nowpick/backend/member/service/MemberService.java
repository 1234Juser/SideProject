package com.nowpick.backend.member.service;


import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.dto.*;
import com.nowpick.backend.member.repo.MemberRepository;
import com.nowpick.backend.utils.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MemberService {
    
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    
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
    
    
    // 로그인
    public LoginResponseDTO login( LoginRequestDTO requestDTO) {
        
        // 1. 요청으로 들어온 사용자 이름과 비밀번호 확인
        log.info("로그인 시도: username={}, password={}", requestDTO.getMemberUsername(), requestDTO.getMemberPassword());
        // 여기에 디버그 포인트 1
        
        MemberEntity member = memberRepository.findByMemberUsername(requestDTO.getMemberUsername())
//                        .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 사용자입니다."));
                              .orElseThrow(() -> {
                                  log.warn("로그인 실패: 사용자 {}를 찾을 수 없습니다.", requestDTO.getMemberUsername());
                                  // 여기에 디버그 포인트 2 (사용자를 찾지 못했을 때)
                                  return new UsernameNotFoundException("존재하지 않는 사용자입니다.");
                              });
        
        // 2. 데이터베이스에서 조회된 사용자 정보 확인
        log.info("데이터베이스에서 조회된 사용자: username={}, role={}, nickname={}",
                 member.getMemberUsername(), member.getMemberRole(), member.getMemberNickname());
        log.info("데이터베이스에 저장된 암호화된 비밀번호: {}", member.getMemberPassword());
        // 여기에 디버그 포인트 3
        
        // 3. 비밀번호 일치 여부 확인 직전
        log.info("비밀번호 일치 여부 확인 중... 입력된 비밀번호: [숨김], DB 비밀번호: {}", member.getMemberPassword());
        // 여기에 디버그 포인트 4
        
        if (!passwordEncoder.matches(requestDTO.getMemberPassword(), member.getMemberPassword())) {
            log.warn("로그인 실패: 비밀번호가 일치하지 않습니다. 사용자: {}", requestDTO.getMemberUsername());
            // 여기에 디버그 포인트 5 (비밀번호 불일치 시)
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }
        
        log.info("로그인 성공: 사용자 {}", requestDTO.getMemberUsername());
        // 여기에 디버그 포인트 6 (로그인 성공 시)
        
        // JWT 토큰 생성
        String accessToken = jwtUtil.generateToken(
                                                    member.getMemberId(),
                                                    member.getMemberUsername(),
                                                    member.getMemberRole(),
                                                    member.getMemberNickname()
        );
        
        // LoginResponseDTO 객체 생성 및 반환
        return LoginResponseDTO.builder()
                           .accessToken(accessToken)
                           .memberId(member.getMemberId())
                           .memberUsername(member.getMemberUsername()) // MemberEntity에서 memberUsername을 memberId로 사용
                           .memberRole(member.getMemberRole()) // MemberEntity에서 직접 memberRole 가져옴
                           .memberNickname(member.getMemberNickname())
                           .build();
    }
    
    
    // 회원 정보 조회
    public MemberEntity getMemberInfo( String username ) {
        
        log.debug("username 확인 : ", username);
        
        return  memberRepository.findByMemberUsername(username)
                                    .orElseThrow(() -> new IllegalArgumentException("일치하는 회원을 찾을 수 없습니다." + username));
    }
    
    
    
    // 회원 정보 수정
    public MemberEntity updateMember( String memberUsername, MemberUpdateRequestDTO requestDTO ) {
        
        MemberEntity memberEntity = memberRepository.findByMemberUsername(memberUsername)
                                    .orElseThrow(() -> new EntityNotFoundException("회원 정보를 찾을 수 없습니다."));
        
        // 닉네임 업데이트
        if (requestDTO.getMemberNickname() != null && !requestDTO.getMemberNickname().isEmpty()) {
            // 닉네임 중복 검사 (선택 사항이지만, 요구사항에 따라 필요할 수 있음)
            // if (memberRepository.findByMemberNickname(requestDto.getMemberNickname()).isPresent()) {
            //     throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
            // }
            memberEntity.setMemberNickname(requestDTO.getMemberNickname());
        }
        
        // 전화번호 변경
        if (requestDTO.getMemberPhoneNumber() != null && !requestDTO.getMemberPhoneNumber().isEmpty()) {
            memberEntity.setMemberPhoneNumber(requestDTO.getMemberPhoneNumber());
        }
        
        // 비밀번호 변경 (currentPassword와 newPassword가 모두 DTO에 있을 경우에만)
        if (requestDTO.getCurrentPassword() != null && !requestDTO.getCurrentPassword().isEmpty() &&
            requestDTO.getNewPassword() != null && !requestDTO.getNewPassword().isEmpty()) {
            
            // 현재 비밀번호 확인 requestDTO
            if (!passwordEncoder.matches(requestDTO.getCurrentPassword(), memberEntity.getMemberPassword())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "현재 비밀번호가 일치하지 않습니다.");
            }
            
            // 새 비밀번호 암호화 및 설정
            memberEntity.setMemberPassword(passwordEncoder.encode(requestDTO.getNewPassword()));
        }
        
        // 업데이트 시간 반영
        memberEntity.setMemberUpdatedAt(LocalDateTime.now());
        
        log.debug("변경된 엔티티 확인 : ", memberEntity);
        
        // 변경된 엔티티 저장
        return  memberRepository.save(memberEntity);
        
//        return memberEntity;
    }
    
    
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션으로 성능 향상
    public boolean isNicknameDuplicated(String nickname) {
        // MemberRepository를 사용하여 닉네임이 존재하는지 확인
        return memberRepository.existsByMemberNickname(nickname);
    }
}
