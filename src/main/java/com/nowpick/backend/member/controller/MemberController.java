package com.nowpick.backend.member.controller;


import com.nowpick.backend.member.domain.MemberEntity;
import com.nowpick.backend.member.dto.*;
import com.nowpick.backend.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000")     // React 개발 서버의 CORS 허용 (운영 환경에서는 더 엄격하게 설정 필요)
@Slf4j
public class MemberController {
    
    private final MemberService memberService;
    
    
    // 회원 가입
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


    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login( @RequestBody LoginRequestDTO loginDTO) {
        try {
            
            // 요청 DTO 로깅
//            log.info("로그인 요청: username={}, password={}", loginDTO.getMemberUsername(), loginDTO.getMemberPassword());
            
            
            LoginResponseDTO responseDTO = memberService.login(loginDTO);
//            log.info("responseDTO : {}", responseDTO);
            
            // Map.of 대신 직접 responseDTO 객체 반환
            return ResponseEntity.ok().body(responseDTO);
            
        } catch (IllegalArgumentException e) {
//            log.warn("로그인 실패 - 잘못된 요청: {}", e.getMessage());
            
            // 오류 발생 시에도 ResponseEntity.status().body() 형태로 Map 반환 유지
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            LoginResponseDTO.builder()
                                .accessToken(null)
                                .memberUsername(null)
                                .memberRole(null)
                                .memberNickname(null)
                                .build());
            // 또는 오류 메시지를 포함한 별도의 오류 DTO 사용
        }
    }
    
    
    // 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<MemberEntity> getMemberInfo(@AuthenticationPrincipal UserDetails userDetails ) {
        
        log.info("userDetails 확인 : {}", userDetails); // userDetails.getUsername()은 이제 실제 username일 것입니다.
        log.info("User username from UserDetails: {}", userDetails.getUsername());
        
        
        try {
            String username = userDetails.getUsername();
            MemberEntity member = memberService.getMemberInfo(username);
            return ResponseEntity.status(HttpStatus.OK).body(member);
        } catch(IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    
    // 사용자 정보 수정
    @PatchMapping("/me")
    public ResponseEntity<?> updateMember( @AuthenticationPrincipal UserDetails userDetails,
                                                      @Valid  @RequestBody MemberUpdateRequestDTO requestDTO ) {
        
        try {
            log.info("userDetails.getUsername : {}", userDetails.getUsername());
            MemberEntity updatedMember = memberService.updateMember(userDetails.getUsername(), requestDTO);
            return ResponseEntity.status(HttpStatus.OK).body(updatedMember);
        } catch (Exception e) {
            log.error("회원 정보 수정 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 수정 중 서버 오류가 발생했습니다.");
        }
    }
    
    
    // 닉네임 중복 검사
    @GetMapping("/check-nickname") // GET 요청으로 닉네임 검사
    public ResponseEntity<Boolean> checkNicknameDuplication(@RequestParam String nickname) {
        // memberService를 통해 닉네임 중복 여부를 확인
        boolean isDuplicated = memberService.isNicknameDuplicated(nickname);
        
        // true (중복) 또는 false (사용 가능) 반환
        // 프론트엔드에서 isDuplicated가 true면 중복, false면 사용 가능으로 판단
        return ResponseEntity.ok(isDuplicated);
    }
    
}

