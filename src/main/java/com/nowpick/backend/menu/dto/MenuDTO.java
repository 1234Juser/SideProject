package com.nowpick.backend.menu.dto;

import com.nowpick.backend.menu.domain.MenuCategory;
import com.nowpick.backend.menu.domain.MenuEntity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuDTO {
    
    private Long menuId;
    private String menuName;
    private String menuDescription;
    private Integer menuPrice;
    private MenuCategory menuCategory;
    private String menuImageUrl;
    private Boolean menuIsIceAvailable;
    
    
    public MenuDTO ( MenuEntity menuEntity ) {
        this.menuId = menuEntity.getMenuId ();
        this.menuName = menuEntity.getMenuName ();
        this.menuDescription = menuEntity.getMenuDescription ();
        this.menuPrice = menuEntity.getMenuPrice ();
        this.menuCategory = menuEntity.getMenuCategory ();
        this.menuImageUrl = menuEntity.getMenuImageUrl ();
        this.menuIsIceAvailable = menuEntity.getMenuIsIceAvailable ();
    }
}
