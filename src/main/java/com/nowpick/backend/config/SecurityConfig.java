package com.nowpick.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

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
                                            .requestMatchers("/", "/images/**", "/main", "static/**", "/api/**").permitAll() // 정적 리소스 허용
                                            .anyRequest().authenticated() // 그 외는 인증 필요
        )
        .csrf(csrf -> csrf.disable()) // 개발 중에는 CSRF 비활성화 (권장하지 않음, 프로덕션에서는 활성화해야 함)
        .httpBasic(httpBasic -> httpBasic.disable()); // Basic 인증 사용 안 함 (필요에 따라)
        
        
        return http.build();
    }
}
