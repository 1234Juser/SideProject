package com.nowpick.backend.menu.controller;

import com.nowpick.backend.menu.dto.MenuDTO;
import com.nowpick.backend.menu.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
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
}
