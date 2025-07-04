package com.nowpick.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator; // BasicPolymorphicTypeValidator import
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; // JavaTimeModule import
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);

        // Key Serializer: String (일반적으로 사용)
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());

        // Value Serializer: JSON (객체를 JSON 형태로 저장)
        Jackson2JsonRedisSerializer<Object> jsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);

        // ObjectMapper 설정 (LocalDateTime 등 Java 8 날짜/시간 객체 직렬화/역직렬화 및 다형성 처리)
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Java 8 날짜/시간 모듈 등록
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // 날짜를 타임스탬프가 아닌 ISO 8601 문자열로 직렬화

        // [중요] 다형성(Polymorphism) 처리 설정: 역직렬화 시 클래스 타입 정보를 포함하도록
        // Redis에 저장될 객체들이 다양한 타입일 수 있으므로, 역직렬화 시 올바른 타입으로 복원하기 위해 필요합니다.
        // BasicPolymorphicTypeValidator는 특정 패키지 내의 클래스만 허용하는 등 보안을 강화할 수 있습니다.
        objectMapper.activateDefaultTyping(
                BasicPolymorphicTypeValidator.builder()
                        .allowIfBaseType(Object.class) // 모든 타입을 허용 (필요에 따라 특정 패키지로 제한 가능)
                        .build(),
                ObjectMapper.DefaultTyping.EVERYTHING // 모든 필드에 대해 타입 정보 포함
        );

        jsonRedisSerializer.setObjectMapper(objectMapper);

        redisTemplate.setValueSerializer(jsonRedisSerializer);
        redisTemplate.setHashValueSerializer(jsonRedisSerializer);

        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }
}
