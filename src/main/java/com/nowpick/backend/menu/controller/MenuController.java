package com.nowpick.backend.menu.controller;

import com.nowpick.backend.menu.dto.MenuDTO;
import com.nowpick.backend.menu.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {
    
    private final MenuService menuService;
    
    @GetMapping
    public ResponseEntity<List <MenuDTO>> getMenusByCategory(@RequestParam String category) {
        List<MenuDTO> menus = menuService.getMenusByCategory(category);
        
        return ResponseEntity.status (HttpStatus.OK).body (menus);
    }
}
