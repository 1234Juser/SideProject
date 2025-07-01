package com.nowpick.backend.store.dto;

import com.nowpick.backend.store.domain.StoreEntity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StoreDTO {
    
    private Long storeId;
    private String storeRegion;
    private String storeName;
    private String storeStatus;
    private String storeAddress;
    private String storeTel;
    
    
    public StoreDTO( StoreEntity storeEntity ) {
        this.storeId = storeEntity.getStoreId();
        this.storeRegion = storeEntity.getStoreRegion();
        this.storeName = storeEntity.getStoreName();
        this.storeStatus = storeEntity.getStoreStatus();
        this.storeAddress = storeEntity.getStoreAddress();
        this.storeTel = storeEntity.getStoreTel();
    }
    
    // 서비스의 scrapeStores메서드에서 사용됨
    public StoreDTO(String storeRegion, String storeName, String storeStatus, String storeAddress, String storeTel) {
        this.storeRegion = storeRegion;
        this.storeName = storeName;
        this.storeStatus = storeStatus;
        this.storeAddress = storeAddress;
        this.storeTel = storeTel;
    }
}
