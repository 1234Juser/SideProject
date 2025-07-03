package com.nowpick.backend.config;

import com.nowpick.backend.utils.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
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
            .csrf(csrf -> csrf.disable()) // 개발 중에는 CSRF 비활성화 (권장하지 않음, 프로덕션에서는 활성화해야 함)
        
        // --- 변경된 부분 시작 ---
        // SecurityConfig에서 자체적으로 CorsFilter 빈을 등록하고,
        // 이 필터가 모든 요청에 대해 CORS 처리를 선행하도록 합니다.
        // 이렇게 하면 WebConfig의 CORS 설정과 독립적으로 Spring Security 필터 체인에서 CORS를 처리합니다.
        .cors(Customizer.withDefaults()) // 이 부분은 CorsConfigurationSource 빈이 있으면 자동으로 사용합니다.
        // --- 변경된 부분 끝 ---
        
            .authorizeHttpRequests(authorize -> authorize
                                                // 1. 가장 구체적인 경로에 대한 permitAll() 먼저 적용
                                                // 로그인, 회원가입, 메뉴 조회 경로는 인증 없이 무조건 허용
                                                .requestMatchers(
                                                "/api/members/login",
                                                "/api/members/signup",
                                                "/api/members/check-nickname",
                                                "/api/menu/**",
                                                "/api/stores/list",
                                                "/",          // 루트 경로
                                                "/images/**", // 이미지
                                                "/main",      // 메인 페이지
                                                "static/**",   // 정적 리소스
                                                "/ws-chat/**" // SockJS의 /info 엔드포인트는 인증 없이 허용 (JWT는 STOMP CONNECT에서 처리)
                                                ).permitAll()
                                                
                            // 2. 그 다음 역할 기반 권한 설정
                            // [사용자] 채팅 세션 생성/가져오기 (POST /chat/session)는 USER 권한만 허용
                            .requestMatchers("/chat/session").hasRole("USER") // USER만 접근 가능하도록 추가
                            // [관리자] 열려있는 모든 채팅 세션 조회는 ADMIN 권한만 허용
                            .requestMatchers( "/chat/sessions/open").hasRole("ADMIN")
                            
                           // 3. 마지막으로 인증이 필요한 넓은 범위의 경로 설정
                            // 예: /api/public/** 같은 공개 API는 permitAll(), /api/private/** 는 authenticated()
                            .requestMatchers("/api/**", "/inquiries/**", "/chat/**","/api/order/**","/api/payments/**"
                            ).authenticated() // 모든 /api/**에 대해 인증 필요 (로그인/회원가입 제외)
                            
                           // 4. 그 외 모든 요청은 인증 필요 (가장 마지막에 위치)
                           // 그 외 모든 요청은 인증 필요
                           .anyRequest().authenticated()
            )
//            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
//        .cors(cors -> {})
        
            // 인증되지 않은 사용자가 보호된 리소스에 접근 시 401 Unauthorized 반환
            .exceptionHandling(exceptions -> exceptions
                                             .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)) // <--- 이 라인 추가
            )
            .httpBasic(httpBasic -> httpBasic.disable()) // Basic 인증 사용 안 함 (필요에 따라)
            
            // 요청 헤더의 JWT를 먼저 검사하고 인증 처리
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    
    // --- 변경된 부분 시작 ---
    // SecurityConfig에서 자체적으로 사용할 CorsConfigurationSource 빈을 정의합니다.
    // 이 빈은 .cors(Customizer.withDefaults())에 의해 자동으로 사용됩니다.
    // WebConfig의 내용과 동일하게 설정하여 일관성을 유지합니다.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // WebConfig와 동일하게 특정 Origin을 명시합니다.
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        // 모든 HTTP 메서드 허용
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        // 모든 헤더 허용
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // 자격 증명 허용
        configuration.setAllowCredentials(true);
        // Pre-flight 요청 캐싱 시간
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
        return source;
    }
    // --- 변경된 부분 끝 ---
    
}
