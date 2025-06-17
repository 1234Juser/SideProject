package com.nowpick.backend.inquiry.controller;

import com.nowpick.backend.inquiry.dto.InquiryDTO;
import com.nowpick.backend.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
@Slf4j
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<InquiryDTO.InquiryResponse> createInquiry(@RequestBody InquiryDTO.CreateInquiryRequest request, Principal principal) {
        String memberUsername = principal.getName();
        InquiryDTO.InquiryResponse response = inquiryService.createInquiry(request, memberUsername);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<InquiryDTO.InquiryListResponse>> getInquiries(Pageable pageable, Principal principal) {
        String memberUsername = principal.getName();
        Page<InquiryDTO.InquiryListResponse> inquiries = inquiryService.getInquiries(pageable, memberUsername);
        return ResponseEntity.ok(inquiries);
    }

    @GetMapping("/{inquiryId}")
    public ResponseEntity<InquiryDTO.InquiryResponse> getInquiry(@PathVariable Long inquiryId, Principal principal) throws AccessDeniedException {
        String memberUsername = principal.getName();
        InquiryDTO.InquiryResponse inquiry = inquiryService.getInquiryById(inquiryId, memberUsername);
        return ResponseEntity.ok(inquiry);
    }

    @PostMapping("/{inquiryId}/reply")
    public ResponseEntity<InquiryDTO.ReplyResponse> createOrUpdateReply(
            @PathVariable Long inquiryId,
            @RequestBody InquiryDTO.CreateReplyRequest request,
            Principal principal) throws AccessDeniedException {
        String adminUsername = principal.getName();
        InquiryDTO.ReplyResponse reply = inquiryService.createOrUpdateReply(inquiryId, request, adminUsername);
        return ResponseEntity.ok(reply);
    }

    // 새롭게 추가되는 엔드포인트
    @PostMapping("/close")
    public ResponseEntity<String> closeInquiries(@RequestBody List<Long> inquiryIds, Principal principal) {
        String memberUsername = principal.getName();
        try {
            inquiryService.closeInquiries(inquiryIds, memberUsername);
            return ResponseEntity.ok("문의가 성공적으로 종료되었습니다.");
        } catch (AccessDeniedException e) {
            log.warn("문의 종료 권한 없음: {}", e.getMessage());
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("문의 종료 실패 - 유효하지 않은 요청: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            log.error("문의 종료 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("문의 종료 중 오류가 발생했습니다.");
        }
    }
    @DeleteMapping("/{inquiryId}/reply")
    public ResponseEntity<String> deleteReply(@PathVariable Long inquiryId, Principal principal) throws AccessDeniedException {
        String adminUsername = principal.getName();
        try {
            inquiryService.deleteReply(inquiryId, adminUsername);
            return ResponseEntity.ok("답변이 성공적으로 삭제되었습니다.");
        } catch (AccessDeniedException e) {
            log.warn("답변 삭제 권한 없음: {}", e.getMessage());
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("답변 삭제 실패 - 유효하지 않은 요청: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            log.warn("답변 삭제 실패 - 상태 오류: {}", e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage()); // Conflict
        } catch (Exception e) {
            log.error("답변 삭제 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("답변 삭제 중 오류가 발생했습니다.");
        }
    }


}

