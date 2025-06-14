package com.nowpick.backend.utils;

import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.util.Base64;

public class JwtKeyGenerator {
    
    public static void main(String[] args) {
        SecretKey key        = Jwts.SIG.HS256.key().build(); // HS256에 적합한 256비트 키 생성
        String    encodedKey = Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println("Generated HS256 Key: " + encodedKey);
        // 이 생성된 키를 복사하여 application.properties에 붙여넣으세요.
    }
    // ... (getSecretKeyFromBase64 메소드는 필요 시 추가)
    
}
