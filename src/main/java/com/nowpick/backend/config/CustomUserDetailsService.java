package com.nowpick.backend.config;

import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.repo.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {
    
    private final MemberRepository memberRepository;
    
    @Override
    public UserDetails loadUserByUsername( String memberUsername) throws UsernameNotFoundException {
        // 데이터베이스에서 memberUsername으로 사용자 정보 조회
        MemberEntity member = memberRepository.findByMemberUsername(memberUsername)
                              .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + memberUsername));
        
        // MemberEntity를 Spring Security의 UserDetails 객체로 변환
        // 이때 사용자의 권한(memberRole)을 SimpleGrantedAuthority로 변환하여 설정
        // 비밀번호는 이미 암호화되어 DB에 저장되어 있으므로 그대로 사용
        return new User(
        member.getMemberUsername(), // 사용자명 (principal)
        member.getMemberPassword(), // 암호화된 비밀번호 (credential)
        Collections.singletonList(new SimpleGrantedAuthority(member.getMemberRole())) // 사용자 권한 (예: ROLE_USER, ROLE_ADMIN)
        );
    }
}
