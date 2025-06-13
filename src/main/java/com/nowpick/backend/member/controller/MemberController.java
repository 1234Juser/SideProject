package com.nowpick.backend.member.controller;


import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.dto.MemberResponseDTO;
import com.nowpick.backend.member.dto.MemberSignupRequestDTO;
import com.nowpick.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000")     // React 개발 서버의 CORS 허용 (운영 환경에서는 더 엄격하게 설정 필요)
public class MemberController {
    
    private final MemberService memberService;
    
    
    @PostMapping("/signup")
    public ResponseEntity <?> signup( @RequestBody MemberSignupRequestDTO requestDTO) {
        try {
            MemberResponseDTO member = memberService.signup(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공 : " + member.getMemberUsername());
        } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 처리 중 서버 오류가 발생했습니다.");
        }
    }


}

