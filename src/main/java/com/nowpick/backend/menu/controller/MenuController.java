package com.nowpick.backend.menu.controller;

import com.nowpick.backend.menu.domain.MenuEntity;
import com.nowpick.backend.menu.dto.MenuDTO;
import com.nowpick.backend.menu.service.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@Slf4j
public class MenuController {
    
    private final MenuService menuService;
    
    
    // 카테고리별 메뉴 전체 조회
    @GetMapping
    public ResponseEntity<List <MenuDTO>> getMenusByCategory(@RequestParam String category) {
        List<MenuDTO> menus = menuService.getMenusByCategory(category);
        
        return ResponseEntity.status (HttpStatus.OK).body (menus);
    }
    
    
    // 메뉴 옵션 선택 페이지
    @GetMapping("/option/{menuId}")
    public ResponseEntity<MenuDTO> getMenuById(@PathVariable Long menuId) {
        MenuDTO menu = menuService.getMenuById(menuId);
        
        return ResponseEntity.status(HttpStatus.OK).body(menu);
    }

    // 모든 메뉴 조회
    @GetMapping("/all")
    public ResponseEntity<List<MenuDTO>> getAllMenus(
            @AuthenticationPrincipal UserDetails userDetails // [추가] UserDetails 받기
    ) {
        if (userDetails != null) {
            log.info("MenuController: /api/menu/all 요청 - 인증된 사용자: {}", userDetails.getUsername());
            log.info("MenuController: /api/menu/all 요청 - 사용자 권한: {}", userDetails.getAuthorities());
        } else {
            log.warn("MenuController: /api/menu/all 요청 - 인증 정보 없음 (UserDetails is null).");
            // 이 경우 401 Unauthorized가 발생해야 정상입니다.
            // 만약 인증이 통과했는데도 UserDetails가 null이라면 다른 설정 문제일 수 있습니다.
        }

        List<MenuDTO> menus = menuService.getAllMenus();
        return ResponseEntity.ok(menus);
    }



}
