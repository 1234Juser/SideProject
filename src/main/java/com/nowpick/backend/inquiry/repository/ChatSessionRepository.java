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

    //사용자가 현재 열려있는 채팅 세션을 메시지와 함께 조회
    @Query("SELECT cs FROM ChatSessionEntity cs LEFT JOIN FETCH cs.messages WHERE cs.member = :member AND cs.status = :status")
    Optional<ChatSessionEntity> findByMemberAndStatusWithMessages(@Param("member") MemberEntity member, @Param("status") ChatSessionStatus status);

    // 특정 상태의 모든 채팅 세션을 메시지와 함께 조회 (관리자용)
    @Query("SELECT cs FROM ChatSessionEntity cs LEFT JOIN FETCH cs.messages WHERE cs.status = :status")
    List<ChatSessionEntity> findByStatusWithMessages(@Param("status") ChatSessionStatus status);


}
