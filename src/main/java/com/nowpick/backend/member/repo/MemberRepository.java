package com.nowpick.backend.member.repo;

import com.nowpick.backend.member.domain.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
    
    Optional<MemberEntity> findByMemberUsername ( String MemberUsername );
    
    boolean existsByMemberUsername ( String MemberUsername );
    
    boolean existsByMemberEmail( String memberEmail );
    
    // 닉네임으로 회원이 존재하는지 확인하는 메서드 추가
    boolean existsByMemberNickname( String nickname );
}
