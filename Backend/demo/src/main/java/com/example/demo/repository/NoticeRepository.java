package com.example.demo.repository;

import com.example.demo.entity.Notice;
import com.example.demo.entity.enums.NoticeAudience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByCreatedAtDesc();
    List<Notice> findByAudienceInOrderByCreatedAtDesc(Collection<NoticeAudience> audiences);
}
