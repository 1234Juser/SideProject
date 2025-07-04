package com.nowpick.backend.cart.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID; // UUID 임포트 추가

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash(value = "cartItem", timeToLive = 86400L) // "cartItem"이라는 이름의 Redis Hash에 저장, 24시간 후 만료
public class CartItemRedis implements Serializable {

    @Id
    private String id; // Redis Key (고유한 장바구니 항목 ID)

    @Indexed
    private Long memberId;

    private Long menuId;
    private Integer quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 장바구니 항목을 새로 생성할 때 호출되는 생성자
    public CartItemRedis(Long memberId, Long menuId, Integer quantity) {
        this.id = UUID.randomUUID().toString(); // [수정됨] 새로운 항목 생성 시 고유 ID 할당
        this.memberId = memberId;
        this.menuId = menuId;
        this.quantity = quantity;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 수량 업데이트 시 호출
    public void updateQuantity(Integer newQuantity) {
        this.quantity = newQuantity;
        this.updatedAt = LocalDateTime.now();
    }
}
