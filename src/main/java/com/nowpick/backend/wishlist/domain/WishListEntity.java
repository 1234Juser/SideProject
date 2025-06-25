package com.nowpick.backend.wishlist.domain;

import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.menu.domain.MenuEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_wishlist", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"member_id", "menu_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class WishListEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_id")
    private Long wishlistId;

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩 설정 (필요할 때 로딩)
    @JoinColumn(name = "member_id", nullable = false) // 실제 DB 컬럼명
    private MemberEntity member; // MemberEntity 객체 참조

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩 설정
    @JoinColumn(name = "menu_id", nullable = false) // 실제 DB 컬럼명
    private MenuEntity menu; // MenuEntity 객체 참조

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;


}
