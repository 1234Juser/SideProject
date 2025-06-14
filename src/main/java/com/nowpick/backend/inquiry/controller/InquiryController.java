package com.nowpick.backend.inquiry.controller;

import com.nowpick.backend.inquiry.dto.InquiryDTO;
import com.nowpick.backend.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.Principal;

@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
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
}

