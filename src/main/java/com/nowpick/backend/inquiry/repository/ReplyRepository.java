package com.nowpick.backend.inquiry.repository;

import com.nowpick.backend.inquiry.domain.ReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyRepository extends JpaRepository<ReplyEntity, Long> {
}
