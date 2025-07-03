package com.nowpick.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtUtil {
    
    
    
    // application.properties에 등록한 값 주입
    @Value("${jwt.secret-key}") // application.properties에서 'jwt.secret-key'로 설정되어 있다면 이대로 사용
    private String secretKey;
    
    @Value("${jwt.expiration}")
    private long expiration;

    // [추가됨] 스프링 빈 초기화 시점에 이 메서드가 호출되어 secretKey와 expiration 값을 로깅합니다.
    @PostConstruct
    public void init() {
        log.info("JwtUtil initialized. Loaded secretKey: {}", secretKey);
        log.info("JwtUtil initialized. Loaded expiration: {}", expiration);
        // [추가됨] 디버깅 목적으로 secretKey로 키 생성 시도:
        try {
            SecretKey key = getSigningKey(); // [추가됨] getSigningKey()가 제대로 작동하는지 확인
            log.info("SecretKey successfully decoded and key generated during init.");
        } catch (Exception e) {
            log.error("Error decoding secretKey or generating key during init: {}", e.getMessage());
        }
    }
    
    // SecretKey 객체를 반환하는 헬퍼 메소드
    private SecretKey getSigningKey() {
        // Base64로 인코딩된 secretKey 문자열을 디코딩하여 바이트 배열로 변환
        // 그리고 Keys.hmacShaKeyFor를 사용하여 SecretKey 객체 생성
        // 이 방식은 Base64로 인코딩된 강력한 키를 가정합니다.
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
    
    
    // JWT 토큰 생성: memberRole을 String 타입으로 받도록 변경
    public String generateToken(Long memberId, String memberUsername, String memberRole, String memberNickname) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        // memberRole은 이미 String 타입이므로 별도의 처리 없이 직접 클레임에 추가
        return Jwts.builder()
               .setSubject(String.valueOf(memberId))
               .claim("memberUsername", memberUsername)
               .claim("memberRole", memberRole)
               .claim("memberNickname", memberNickname)
               .setIssuedAt(now)
               .setExpiration(expiryDate)
               .signWith(getSigningKey(), SignatureAlgorithm.HS256)
               .compact();
    }
    
    
    // 토큰에서 멤버 ID (subject, 즉 memberUsername) 추출
    public String getMemberIdFromToken(String token) {
        Claims claims = Jwts.parser()
                                                .verifyWith(getSigningKey())
                                                .build()
                                                .parseSignedClaims(token)
                                                .getPayload();
                                
        return claims.getSubject();
    }
    
    
    // 토큰에서 멤버 닉네임 추출 (String 타입)
    public String getMemberNicknameFromToken(String token) {
        Claims claims = Jwts.parser()
                        .verifyWith(getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
        return claims.get("memberNickname", String.class);
    }
    
    
    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser() // Jwts.parser() 사용
            .verifyWith(getSigningKey()) // 서명 검증
            .build() // 파서 빌드
            .parseSignedClaims(token); // 서명된 클레임 파싱
            log.trace("Token validation successful for token: {}", token); // 성공 시 TRACE 로그
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | io.jsonwebtoken.MalformedJwtException e) {
            log.warn("Invalid JWT signature or structure for token [{}]: {}", token, e.getMessage());
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.warn("Expired JWT token [{}]: {}", token, e.getMessage());
        } catch (io.jsonwebtoken.UnsupportedJwtException e) {
            log.warn("Unsupported JWT token [{}]: {}", token, e.getMessage());
        } catch (IllegalArgumentException e) {
            // 이 예외는 토큰 문자열이 null이거나 비었을 때 주로 발생
            log.warn("JWT claims string is empty or null for token [{}]: {}", token, e.getMessage());
        } catch (Exception e) {
            log.error("Token validation failed for an unexpected reason for token [{}]: {}", token, e.getMessage(), e);
        }
        return false;
    }
    
    
    // 토큰에서 단일 역할(memberRole) 추출
    public String getMemberRoleFromToken(String token) {
        Claims claims = Jwts.parser() // Jwts.parser() 사용
                        .verifyWith(getSigningKey()) // 서명 검증
                        .build() // 파서 빌드
                        .parseSignedClaims(token) // 서명된 클레임 파싱
                        .getPayload(); // 페이로드(클레임) 추출
        
        return claims.get("memberRole", String.class); // "memberRole" 클레임을 String 타입으로 반환
    }
    
    
    // 사용자 이름 (memberName) 클레임 추출 (필요시)
    // 현재 MemberEntity에 memberName 필드가 직접 없으므로, 해당 필드가 JWT에 추가되지 않는다면 이 메소드는 사용 불가
    // memberUsername을 사용하려면 generateToken에서 memberUsername을 클레임으로 추가해야 함
    public String getMemberUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                            .verifyWith(getSigningKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();
            return claims.get("memberUsername", String.class); // generateToken에서 "memberUsername" 클레임으로 추가했으므로

        } catch (Exception e) {
            log.error("Failed to get memberUsername from token [{}]: {}", token, e.getMessage());
            return null;
        }
    }
}