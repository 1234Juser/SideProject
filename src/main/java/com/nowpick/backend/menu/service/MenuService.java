package com.nowpick.backend.menu.service;

import com.nowpick.backend.menu.domain.MenuCategory;
import com.nowpick.backend.menu.domain.MenuEntity;
import com.nowpick.backend.menu.dto.MenuDTO;
import com.nowpick.backend.menu.repo.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {
    
    private final MenuRepository menuRepository;
    
    
    // 모든 메뉴 목록 조회
    public List<MenuDTO> getMenusByCategory (String category ) {
        
        MenuCategory menuCategory = MenuCategory.valueOf(category); // COFFEE → enum
        
        List<MenuEntity> menuEntityList = menuRepository.findByMenuCategory(menuCategory);
        List<MenuDTO> menuList = menuEntityList.stream ()
                                 .map ( menu -> new MenuDTO (menu))
                                 .toList ();
        
        log.info ("menuList : {}", menuList);
        
        return menuList;
        
    }
    
    
    // 메뉴 상세 조회
    public MenuDTO getMenuById (Long menuId) {
        
        MenuEntity menuEntity = menuRepository.findById(menuId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 메뉴를 찾을 수 없습니다. " + menuId));
        
        return new MenuDTO(menuEntity);
        
    }
}
