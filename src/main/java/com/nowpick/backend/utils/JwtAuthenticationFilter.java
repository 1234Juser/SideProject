package com.nowpick.backend.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil; // JWT 유틸리티 주입
    private final UserDetailsService userDetailsService; // 사용자 정보 로드를 위한 서비스 주입
    
    
    @Override
    protected void doFilterInternal( HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization"); // Authorization 헤더에서 JWT 추출
        final String jwt;
        final String memberUsername;
        
        // 1. Authorization 헤더가 없거나 "Bearer "로 시작하지 않으면 다음 필터로 진행
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // 2. JWT 토큰 추출 ( "Bearer " 부분을 제외한 실제 토큰 값)
        jwt = authHeader.substring(7);
        log.debug("Extracted JWT: {}", jwt);
        
        try {
            // 3. JWT에서 사용자 이름(subject) 추출
            memberUsername = jwtUtil.getMemberUsernameFromToken(jwt); // JwtUtil을 사용하여 사용자 이름 추출
            
            // 4. 사용자 이름이 존재하고, 현재 SecurityContext에 인증 정보가 없는 경우
            if (memberUsername != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 5. UserDetailsService를 통해 사용자 정보 로드
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(memberUsername);
                log.debug("User details loaded: {}", userDetails.getUsername());
                
                // 6. JWT 토큰 유효성 검증
                if (jwtUtil.validateToken(jwt)) {
                    // 7. 유효한 토큰인 경우, 인증 객체 생성
                    // 비밀번호는 이미 검증되었으므로 null로 설정
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null, // JWT 인증이므로 비밀번호는 필요 없음
                    userDetails.getAuthorities() // 사용자의 권한 설정
                    );
                    // 요청에 대한 웹 인증 세부 정보 설정
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // 8. SecurityContextHolder에 인증 객체 설정
                    // 이로써 현재 요청이 인증된 것으로 간주됨
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("User '{}' authenticated and security context updated.", memberUsername);
                } else {
                    log.warn("JWT token validation failed for user: {}", memberUsername);
                }
            }
        } catch (Exception e) {
            // JWT 관련 예외 발생 시 (만료, 서명 오류 등)
            log.error("JWT authentication failed: {}", e.getMessage());
            // 에러를 response에 바로 쓰지 않고, Spring Security의 ExceptionHandling 필터로 넘김
            // (AuthenticationEntryPoint가 401 Unauthorized를 반환하도록 설정되어 있음)
        }
        
        // 다음 필터 체인으로 요청 전달
        filterChain.doFilter(request, response);
    }
}
