package com.nowpick.backend.menu.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MenuCategory {
    
    COFFEE("커피"),
    NON_COFFEE("논커피"),
    DESSERT("디저트");
    
    private final String displayName; // 사용자에게 보여줄 한글 이름
    
    // String 값을 Enum으로 변환하기 위한 헬퍼 메서드 (선택 사항, 필요시 사용)
    public static MenuCategory fromDisplayName(String displayName) {
        for (MenuCategory category : MenuCategory.values()) {
            if (category.displayName.equalsIgnoreCase(displayName)) {
                return category;
            }
        }
        // 유효하지 않은 displayName이 들어올 경우 처리
        throw new IllegalArgumentException("유효하지 않은 메뉴 카테고리 이름입니다: " + displayName);
    }
}
