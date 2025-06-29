package com.nowpick.backend.store.repo;

import com.nowpick.backend.store.domain.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    
    boolean existsByStoreNameAndStoreAddress(String storeName, String storeAddress);     // 중복 방지용
}
