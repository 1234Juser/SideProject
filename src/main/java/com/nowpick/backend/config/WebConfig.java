package com.nowpick.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;

@Configuration
@Slf4j
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;
    
    
    @Override
    public void addCorsMappings( CorsRegistry registry) {
        registry.addMapping("/**")
        // 모든 경로에 대해 CORS 설정을 적용합니다.
        // 즉, /api/**, /login, /member 등 모든 컨트롤러 URL 경로가 대상입니다.
        
//        .allowedOriginPatterns("*")
        // 어떤 Origin(출처, 주소)이든 접근을 허용합니다.
        // 예: http://localhost:3000 (React 개발 서버), http://myfrontend.com 등
        // "allowedOrigins()" 대신 "allowedOriginPatterns()"을 사용한 이유는
        // allowCredentials(true)를 사용할 경우 와일드카드("*")는 allowedOrigins()에서 사용할 수 없기 때문입니다.
        .allowedOrigins("http://localhost:3000") // <-- 이 부분을 변경
        
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        // HTTP 메서드 중에서 이 네 가지 방식에 대해서만 허용합니다. patch 추가
        // 예: React에서 GET으로 데이터 요청하거나, POST로 폼 제출 시 허용됨
        
        .allowedHeaders("*")
        // 요청 시 어떤 헤더든 모두 허용합니다.
        // 예: Content-Type, Authorization 등 다양한 커스텀 헤더 포함 가능
        
        .allowCredentials(true);
        // 쿠키나 인증 정보(세션, 토큰 등)를 포함한 요청을 허용합니다.
        // 보통 로그인 유지나 인증이 필요한 API 요청에 사용되며,
        // 클라이언트 측 fetch/axios 요청 시 `{ withCredentials: true }` 설정이 함께 필요합니다.
    }
    
    
    @Bean
    public RestTemplate restTemplate( RestTemplateBuilder builder ) {
        // 모든 요청에 Authorization 헤더를 기본으로 추가
        // KakaoMapService에서 RequestEntity를 만들 때 헤더를 별도로 설정할 필요가 없습니다.
        return builder
               .defaultHeader(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoRestApiKey)
               .defaultHeader(HttpHeaders.ORIGIN, "http://localhost:8080") // ⭐ 중요: 백엔드 서버의 Origin 주소로 설정 ⭐
               .interceptors(new ClientHttpRequestInterceptor() { // 익명 클래스로 인터셉터 정의
                   @Override
                   public ClientHttpResponse intercept( HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException, IOException {
                       log.info(">>>> RestTemplate Request URL: {}", request.getURI());
                       log.info(">>>> RestTemplate Request Headers: {}", request.getHeaders());
                       // 실제 Origin 헤더가 여기에 포함되어 있는지 확인!
                       if (request.getHeaders().containsKey(HttpHeaders.ORIGIN)) {
                           log.info(">>>> Actual Origin Header Sent: {}", request.getHeaders().get(HttpHeaders.ORIGIN));
                       } else {
                           log.warn(">>>> Origin Header NOT found in RestTemplate request!");
                       }
                       return execution.execute(request, body);
                   }
               })
               .build();
    }
}
