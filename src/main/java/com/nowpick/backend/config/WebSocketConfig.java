package com.nowpick.backend.config;

import com.nowpick.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Collections;

@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커를 활성화합니다.
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtil jwtUtil;


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

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String token = null;

                    // 1. Authorization 헤더에서 토큰 추출 (STOMP CONNECT 프레임에서 전달될 경우)
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        token = authHeader.substring(7);
                    }

                    // 2. URL 쿼리 파라미터에서 토큰 추출 (SockJS의 경우, nativeHeader로 변환될 수 있음)
                    // 프론트엔드에서 URL에 '?token='을 사용하여 전달한 경우
                    if (token == null) {
                        String queryToken = accessor.getFirstNativeHeader("token");
                        if (queryToken != null) {
                            token = queryToken;
                        }
                    }

                    if (token != null && jwtUtil.validateToken(token)) {
                        String username = jwtUtil.getMemberUsernameFromToken(token);
                        String role = jwtUtil.getMemberRoleFromToken(token);

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(new SimpleGrantedAuthority(role)));

                        // STOMP 세션에 인증 정보 설정 -> @MessageMapping 메서드에서 Principal 주입 가능
                        accessor.setUser(authentication);
                        // SecurityContextHolder에도 설정 (필요시)
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        System.out.println("WebSocket 인증 성공: " + username + " with role " + role);
                    } else {
                        System.out.println("WebSocket 인증 실패: 유효하지 않은 토큰");
                        // 유효하지 않은 토큰일 경우 메시지 처리를 중단하여 연결을 거부할 수 있음
                        // return null; // 연결 끊기를 강제하려면 이 주석을 해제
                    }
                } else if (StompCommand.SEND.equals(accessor.getCommand()) || StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    // CONNECT 이후의 메시지에 대해서는 세션의 Principal이 설정되어 있는지 확인
                    if (accessor.getUser() == null) {
                        System.out.println("WebSocket 메시지 전송/구독 실패: 인증되지 않은 사용자");
                        return null; // 인증되지 않은 메시지 전송/구독 방지
                    }
                }
                return message;
            }
        });
    }
}



