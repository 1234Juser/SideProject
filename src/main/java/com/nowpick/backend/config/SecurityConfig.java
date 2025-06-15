package com.nowpick.backend.config;

import com.nowpick.backend.utils.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain( HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                                                // 로그인, 회원가입, 메뉴 조회 경로는 인증 없이 무조건 허용
                                                .requestMatchers(
                                                "/api/members/login",
                                                "/api/members/signup",
                                                "/api/menu/**",
                                                "/",          // 루트 경로
                                                "/images/**", // 이미지
                                                "/main",      // 메인 페이지
                                                "static/**",   // 정적 리소스
                                                "/ws-chat/**" // SockJS의 /info 엔드포인트는 인증 없이 허용 (JWT는 STOMP CONNECT에서 처리)
                                                ).permitAll()
                            // [사용자] 채팅 세션 생성/가져오기 (POST /chat/session)는 USER 권한만 허용
                            .requestMatchers("/chat/session").hasRole("USER") // USER만 접근 가능하도록 추가
                            // [관리자] 열려있는 모든 채팅 세션 조회는 ADMIN 권한만 허용
                            .requestMatchers( "/chat/sessions/open").hasRole("ADMIN")
                            // 예: /api/public/** 같은 공개 API는 permitAll(), /api/private/** 는 authenticated()
                            .requestMatchers("/api/**", "/inquiries/**", "/chat/**").authenticated() // 모든 /api/**에 대해 인증 필요 (로그인/회원가입 제외)
    //                                            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)       //  JWT 토큰 기반 인증을 도입시 필요
                                                // 그 외 모든 요청은 인증 필요
                                                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable()) // 개발 중에는 CSRF 비활성화 (권장하지 않음, 프로덕션에서는 활성화해야 함)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
            // 인증되지 않은 사용자가 보호된 리소스에 접근 시 401 Unauthorized 반환
            .exceptionHandling(exceptions -> exceptions
                                             .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)) // <--- 이 라인 추가
            )
            .httpBasic(httpBasic -> httpBasic.disable()) // Basic 인증 사용 안 함 (필요에 따라)
            // JWT 필터를 UsernamePasswordAuthenticationFilter 이전에 추가
            // 이렇게 함으로써 요청 헤더의 JWT를 먼저 검사하고 인증 처리
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    
    // 전역 CORS 설정을 위한 빈 (MemberController의 @CrossOrigin 대신 중앙 집중식 관리)
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // React 개발 서버 주소 허용
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용할 HTTP 메서드
        configuration.setAllowedHeaders(Arrays.asList("*")); // 모든 헤더 허용
        configuration.setAllowCredentials(true); // 자격 증명(쿠키, 인증 헤더 등) 허용
        configuration.setMaxAge(3600L); // Pre-flight 요청 캐싱 시간 (초)
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
        return source;
    }
}
