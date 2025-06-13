package com.nowpick.backend.member.repo;

import com.nowpick.backend.member.domain.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
    
    Optional<MemberEntity> findByMemberUsername ( String MemberUsername );
    
    boolean existsByMemberUsername ( String MemberUsername );
    
    boolean existsByMemberEmail( String memberEmail );
    
    
}
