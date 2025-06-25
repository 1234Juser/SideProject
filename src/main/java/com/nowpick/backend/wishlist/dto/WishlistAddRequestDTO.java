package com.nowpick.backend.wishlist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishlistAddRequestDTO {
    @NotNull(message = "메뉴 ID는 필수입니다.")
    private Long menuId;

}
