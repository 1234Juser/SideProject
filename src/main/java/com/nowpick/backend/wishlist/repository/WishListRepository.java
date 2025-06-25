package com.nowpick.backend.wishlist.repository;

import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.menu.domain.MenuEntity;
import com.nowpick.backend.wishlist.domain.WishListEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;


public interface WishListRepository extends JpaRepository<WishListEntity, Long> {

    Optional<WishListEntity> findByMemberAndMenu(MemberEntity member, MenuEntity menu);
    List<WishListEntity> findAllByMemberOrderByCreatedAtDesc(MemberEntity member);
    void deleteByMemberAndMenu(MemberEntity member, MenuEntity menu);
    boolean existsByMemberAndMenu(MemberEntity member, MenuEntity menu);
}
