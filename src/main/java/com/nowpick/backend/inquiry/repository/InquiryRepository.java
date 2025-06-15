package com.nowpick.backend.inquiry.repository;

import com.nowpick.backend.inquiry.domain.InquiryEntity;
import com.nowpick.backend.member.domain.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryRepository extends JpaRepository<InquiryEntity, Long> {
    Page<InquiryEntity> findByMember(MemberEntity member, Pageable pageable);
}

