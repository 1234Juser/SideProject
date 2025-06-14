package com.nowpick.backend.menu.domain;

import com.nowpick.backend.menu.dto.MenuDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_menu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class MenuEntity {
    
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "menu_id", nullable = false)
    private Long menuId;
    
    @Column(name = "menu_name", nullable = false, length = 20)
    private String menuName;
    
    @Column(name = "menu_description", columnDefinition = "TEXT", nullable = false)
    private String menuDescription;
    
    @Column(name = "menu_price", nullable = false)
    private Integer menuPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "menu_category", nullable = false, length = 20)
    private MenuCategory menuCategory;
    
    @Column(name = "menu_image_url", nullable = false)
    private String menuImageUrl;
    
    @Column(name = "menu_is_ice_available", nullable = false)
    private Boolean menuIsIceAvailable = true;      // 기본값 true
    
    
    @PrePersist
    public void prePersist() {
        if (this.menuIsIceAvailable == null) {
            this.menuIsIceAvailable = true;
        }
    }
    
    
    public MenuEntity( MenuDTO menuDTO ) {
        this.menuId = menuDTO.getMenuId ();
        this.menuName = menuDTO.getMenuName ();
        this.menuDescription = menuDTO.getMenuDescription ();
        this.menuPrice = menuDTO.getMenuPrice ();
        this.menuCategory = menuDTO.getMenuCategory ();
        this.menuImageUrl = menuDTO.getMenuImageUrl ();
        this.menuIsIceAvailable = menuDTO.getMenuIsIceAvailable ();
    }
    
}
