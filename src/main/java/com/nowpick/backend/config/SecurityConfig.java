package com.nowpick.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain( HttpSecurity http) throws Exception {
        http
        .authorizeHttpRequests(authorize -> authorize
                                            // 로그인 및 회원가입 경로는 명시적으로 인증 없이 허용
                                            .requestMatchers("/api/members/login", "/api/members/signup").permitAll()
                                            // 메뉴 조회 경로를 인증 없이 허용 (로그인 여부와 상관없이 메뉴는 볼 수 있어야 하므로)
                                            .requestMatchers("/api/menu/**").permitAll() // <--- 이 라인 추가!
                                            // 정적 리소스 및 기본 경로 허용 (기존 설정 유지)
                                            .requestMatchers("/", "/images/**", "/main", "static/**").permitAll()
                                            // 나머지 모든 /api/** 경로는 인증 필요 (JWT 필터가 있다면 여기 적용됨)
                                            // 현재 /api/members/** 가 위에서 이미 permitAll 되었으므로, 필요에 따라 조정
                                            // 예: /api/public/** 같은 공개 API는 permitAll(), /api/private/** 는 authenticated()
                                            .requestMatchers("/api/**").authenticated() // 모든 /api/**에 대해 인증 필요 (로그인/회원가입 제외)
//                                            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)       //  JWT 토큰 기반 인증을 도입시 필요
                                            .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
        )
        .csrf(csrf -> csrf.disable()) // 개발 중에는 CSRF 비활성화 (권장하지 않음, 프로덕션에서는 활성화해야 함)
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
        .httpBasic(httpBasic -> httpBasic.disable()); // Basic 인증 사용 안 함 (필요에 따라)
        
        
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
