package com.nowpick.backend.inquiry.repository;

import com.nowpick.backend.inquiry.domain.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
}
