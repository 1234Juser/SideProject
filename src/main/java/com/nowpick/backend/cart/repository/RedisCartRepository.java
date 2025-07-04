package com.nowpick.backend.cart.repository;

import com.nowpick.backend.cart.domain.CartItemRedis;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
public class RedisCartRepository {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String HASH_KEY_PREFIX = "cart:member:"; // 회원 ID별 장바구니 해시의 접두사
    private static final long CART_TTL_HOURS = 24; // 장바구니 유효 시간 (24시간)

    /**
     * 장바구니 항목 저장 또는 업데이트
     * Redis의 Hash 구조를 사용하여 `cart:member:{memberId}` 키 아래에 `menuId`를 필드로, `CartItemRedis` 객체를 값으로 저장합니다.
     *
     * @param cartItemRedis 저장할 장바구니 항목
     * @return 저장된 장바구니 항목
     */
    public CartItemRedis save(CartItemRedis cartItemRedis) {
        String memberCartKey = HASH_KEY_PREFIX + cartItemRedis.getMemberId();
        // Redis Hash에 저장: HSET key field value
        redisTemplate.opsForHash().put(memberCartKey, cartItemRedis.getMenuId().toString(), cartItemRedis);
        // 장바구니 키에 TTL 설정 (매번 업데이트 시 TTL 갱신)
        redisTemplate.expire(memberCartKey, CART_TTL_HOURS, TimeUnit.HOURS);
        log.info("Redis 장바구니 항목 저장/업데이트: memberId={}, menuId={}, quantity={}",
                cartItemRedis.getMemberId(), cartItemRedis.getMenuId(), cartItemRedis.getQuantity());
        return cartItemRedis;
    }

    /**
     * 특정 회원의 장바구니 항목 조회
     *
     * @param memberId 회원 ID
     * @return 해당 회원의 모든 장바구니 항목 리스트
     */
    public List<CartItemRedis> findByMemberId(Long memberId) {
        String memberCartKey = HASH_KEY_PREFIX + memberId;
        // Redis Hash에서 모든 값 가져오기: HVALS key
        List<Object> values = redisTemplate.opsForHash().values(memberCartKey);
        log.info("Redis 장바구니 항목 조회 (memberId={}): {}개 항목", memberId, values.size());
        return values.stream()
                .filter(obj -> obj instanceof CartItemRedis)
                .map(obj -> (CartItemRedis) obj)
                .collect(Collectors.toList());
    }

    /**
     * 특정 회원의 특정 메뉴 장바구니 항목 조회
     *
     * @param memberId 회원 ID
     * @param menuId 메뉴 ID
     * @return Optional<CartItemRedis>
     */
    public Optional<CartItemRedis> findByMemberIdAndMenuId(Long memberId, Long menuId) {
        String memberCartKey = HASH_KEY_PREFIX + memberId;
        // Redis Hash에서 특정 필드의 값 가져오기: HGET key field
        Object obj = redisTemplate.opsForHash().get(memberCartKey, menuId.toString());
        log.info("Redis 장바구니 항목 조회 (memberId={}, menuId={}): {}", memberId, menuId, obj != null ? "존재" : "없음");
        if (obj instanceof CartItemRedis) {
            return Optional.of((CartItemRedis) obj);
        }
        return Optional.empty();
    }

    /**
     * 장바구니 항목 삭제
     *
     * @param memberId 회원 ID
     * @param menuId 삭제할 메뉴 ID
     */
    public void deleteByMemberIdAndMenuId(Long memberId, Long menuId) {
        String memberCartKey = HASH_KEY_PREFIX + memberId;
        // Redis Hash에서 필드 삭제: HDEL key field
        redisTemplate.opsForHash().delete(memberCartKey, menuId.toString());
        log.info("Redis 장바구니 항목 삭제: memberId={}, menuId={}", memberId, menuId);
    }

    /**
     * 특정 회원의 장바구니를 모두 비웁니다.
     * @param memberId 회원 ID
     */
    public void deleteAllByMemberId(Long memberId) {
        String memberCartKey = HASH_KEY_PREFIX + memberId;
        redisTemplate.delete(memberCartKey); // 해당 키 자체를 삭제
        log.info("Redis 장바구니 전체 삭제: memberId={}", memberId);
    }
}
