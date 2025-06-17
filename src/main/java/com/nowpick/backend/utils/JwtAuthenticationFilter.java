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
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService; // 사용자 정보 로드를 위한 서비스 주입
    
    
    // JWT 필터를 적용하지 않을 경로들을 정의합니다.
    // SecurityConfig의 permitAll() 경로와 일치시키는 것이 중요합니다.
    private static final List <String> EXCLUDE_URLS = Arrays.asList(
    "/api/members/login",
    "/api/members/signup",
    "/api/menu/**", // 이 경로를 추가하여 JWT 필터가 동작하지 않도록 합니다.
    "/",
    "/images/**",
    "/main",
    "static/**",
    "/ws-chat/**"
    );
    
    private final AntPathMatcher antPathMatcher = new AntPathMatcher(); // 경로 매칭을 위한 객체
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
       /*// 요청된 URI가 EXCLUDE_URLS 목록에 포함되는지 확인합니다.
        return EXCLUDE_URLS.stream()
               .anyMatch(pattern -> antPathMatcher.match(pattern, request.getRequestURI()));
       */
        String requestUri = request.getRequestURI();
        boolean shouldExclude = EXCLUDE_URLS.stream()
                                .anyMatch(pattern -> antPathMatcher.match(pattern, requestUri));
        
        log.info("Request URI: '{}', Pattern matched: '{}', Should not filter: {}", requestUri,
                 EXCLUDE_URLS.stream().filter(p -> antPathMatcher.match(p, requestUri)).findFirst().orElse("N/A"),
                 shouldExclude); // <-- 이 로그를 통해 확인
        
        return shouldExclude;
    }
    
    
    
    @Override
    protected void doFilterInternal( HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        
        // shouldNotFilter에서 이미 필터링되어 이 코드는 JWT 인증이 필요한 경우에만 실행됩니다.
        final String authHeader = request.getHeader("Authorization"); // Authorization 헤더에서 JWT 추출
        final String jwt;
        final String memberUsername;    // 실제 사용자 이름을 저장할 변수
        
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
            // 여기를 수정: 토큰에서 실제 memberUsername 클레임을 추출하도록 변경
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
