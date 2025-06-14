package com.nowpick.backend.menu.repo;

import com.nowpick.backend.menu.domain.MenuCategory;
import com.nowpick.backend.menu.domain.MenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<MenuEntity, Long> {
    
    List<MenuEntity> findByMenuCategory ( MenuCategory menuCategory );
}
