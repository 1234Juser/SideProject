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

    @Query("SELECT cs FROM ChatSessionEntity cs LEFT JOIN FETCH cs.messages m WHERE cs.id = :sessionId")
    Optional<ChatSessionEntity> findByIdWithMessages(@Param("sessionId") Long sessionId);

    /**
     * 관리자 페이지에서 조회할 활성 채팅 세션 (OPEN 또는 CLOSED 상태) 목록을 가져옵니다.
     * ARCHIVED 상태는 제외합니다.
     */
    @Query("SELECT cs FROM ChatSessionEntity cs " +
            "LEFT JOIN FETCH cs.member " +
            "LEFT JOIN FETCH cs.messages m " +
            "LEFT JOIN FETCH m.sender " +
            "WHERE cs.status IN (:statuses)")
    List<ChatSessionEntity> findByStatusesWithMessages(@Param("statuses") List<ChatSessionStatus> statuses);

    /**
     * [사용자용] 특정 멤버의 모든 채팅 세션을 메시지 및 발신자 정보와 함께 조회합니다.
     * 마이페이지에서 사용자의 모든 1:1 채팅 문의 내역을 보여줄 때 사용합니다.
     */
    @Query("SELECT cs FROM ChatSessionEntity cs " +
            "LEFT JOIN FETCH cs.member " +
            "LEFT JOIN FETCH cs.messages m " +
            "LEFT JOIN FETCH m.sender " +
            "WHERE cs.member = :member " +
            "ORDER BY cs.createdAt DESC") // 최신순으로 정렬
    List<ChatSessionEntity> findByMemberWithMessages(@Param("member") MemberEntity member);


}

