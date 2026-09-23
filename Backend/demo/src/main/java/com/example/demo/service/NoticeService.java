package com.example.demo.service;

import com.example.demo.dto.NoticeDto;
import com.example.demo.dto.NoticeRequest;
import com.example.demo.entity.Notice;
import com.example.demo.entity.User;
import com.example.demo.entity.enums.NoticeAudience;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.NoticeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    public NoticeService(NoticeRepository noticeRepository, UserRepository userRepository) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
    }

    public List<NoticeDto> getNoticesForUser(String role) {
        String r = (role != null ? role.replaceFirst("(?i)^ROLE_", "").toUpperCase() : "STUDENT");
        if ("ADMIN".equals(r)) {
            return noticeRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
        }

        NoticeAudience specificAudience = "STUDENT".equals(r) ? NoticeAudience.STUDENTS : NoticeAudience.TEACHERS;
        return noticeRepository.findByAudienceInOrderByCreatedAtDesc(Arrays.asList(NoticeAudience.ALL, specificAudience)).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public NoticeDto createNotice(NoticeRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));

        Notice notice = new Notice(
                request.getTitle(),
                request.getContent(),
                request.getPriority(),
                request.getAudience(),
                author,
                request.getExpiryDate()
        );

        Notice saved = noticeRepository.save(notice);
        return toDto(saved);
    }

    @Transactional
    public NoticeDto updateNotice(Long id, NoticeRequest request) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with ID: " + id));

        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setPriority(request.getPriority());
        notice.setAudience(request.getAudience());
        notice.setExpiryDate(request.getExpiryDate());

        Notice saved = noticeRepository.save(notice);
        return toDto(saved);
    }

    @Transactional
    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notice not found with ID: " + id);
        }
        noticeRepository.deleteById(id);
    }

    private NoticeDto toDto(Notice n) {
        NoticeDto dto = new NoticeDto();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setContent(n.getContent());
        dto.setPriority(n.getPriority());
        dto.setAudience(n.getAudience());
        if (n.getAuthor() != null) {
            dto.setAuthorId(n.getAuthor().getId());
            dto.setAuthorName(n.getAuthor().getFullName());
        }
        dto.setCreatedAt(n.getCreatedAt());
        dto.setExpiryDate(n.getExpiryDate());
        return dto;
    }
}
