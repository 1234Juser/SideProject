package com.nowpick.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커를 활성화합니다.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry){
        // 클라이언트가 메시지를 구독할 수 있는 경로의 prefix를 설정합니다.
        // /topic, /queue로 시작하는 경로는 메시지 브로커로 라우팅됩니다.
        registry.enableSimpleBroker("/topic", "/queue");

        // 클라이언트가 서버로 메시지를 보낼 때 사용할 경로의 prefix를 설정합니다.
        // /app으로 시작하는 메시지는 @MessageMapping 어노테이션이 붙은 메소드로 라우팅됩니다.
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 또는 SockJS 클라이언트가 연결을 시도할 엔드포인트를 등록합니다.
        // 클라이언트는 "/ws-chat" 경로로 서버에 접속을 시도하게 됩니다.
        // setAllowedOriginPatterns("*")는 모든 출처(CORS)에서의 연결을 허용합니다.
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

}
