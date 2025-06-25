package com.nowpick.backend.wishlist.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class WishlistResponseDTO {
    private Long wishlistId;
    private Long menuId;
    private String menuName;
    private String menuDescription;
    private Integer menuPrice;
    private String menuImageUrl;
    private LocalDateTime createdAt;
}
