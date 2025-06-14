package com.nowpick.backend.inquiry.repository;

import com.nowpick.backend.inquiry.domain.ChatSessionEntity;
import com.nowpick.backend.inquiry.domain.ChatSessionStatus;
import com.nowpick.backend.member.domain.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSessionEntity, Long> {

    /**
     * 사용자가 현재 열려있는 채팅 세션을 멤버, 메시지, 각 메시지의 발신자 정보까지 모두 함께 조회합니다.
     * JOIN FETCH를 사용하여 N+1 문제를 방지하고 LazyInitializationException을 해결합니다.
     */
    @Query("SELECT cs FROM ChatSessionEntity cs " +
            "LEFT JOIN FETCH cs.member " +
            "LEFT JOIN FETCH cs.messages m " +
            "LEFT JOIN FETCH m.sender " +
            "WHERE cs.member = :member AND cs.status = :status")
    Optional<ChatSessionEntity> findByMemberAndStatusWithMessages(@Param("member") MemberEntity member, @Param("status") ChatSessionStatus status);

    /**
     * 특정 상태의 모든 채팅 세션을 멤버, 메시지, 각 메시지의 발신자 정보까지 모두 함께 조회합니다. (관리자용)
     */
    @Query("SELECT cs FROM ChatSessionEntity cs " +
            "LEFT JOIN FETCH cs.member " +
            "LEFT JOIN FETCH cs.messages m " +
            "LEFT JOIN FETCH m.sender " +
            "WHERE cs.status = :status")
    List<ChatSessionEntity> findByStatusWithMessages(@Param("status") ChatSessionStatus status);

}

