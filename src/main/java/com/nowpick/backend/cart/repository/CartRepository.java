//package com.nowpick.backend.cart.repository;
//
//import com.nowpick.backend.cart.domain.CartEntity;
//import com.nowpick.backend.member.domain.MemberEntity;
//import com.nowpick.backend.menu.domain.MenuEntity;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface CartRepository extends JpaRepository<CartEntity, Long> {
//    // 특정 멤버의 장바구니 항목 조회
//    List<CartEntity> findByMember(MemberEntity member);
//
//    // 특정 멤버의 특정 메뉴 장바구니 항목 조회 (존재 여부 확인 및 수량 업데이트용)
//    Optional<CartEntity> findByMemberAndMenu(MemberEntity member, MenuEntity menu);
//
//    // 특정 멤버의 특정 장바구니 항목 삭제 (소유권 확인용)
//    void deleteByCartItemIdAndMember(Long cartItemId, MemberEntity member);
//
//}
