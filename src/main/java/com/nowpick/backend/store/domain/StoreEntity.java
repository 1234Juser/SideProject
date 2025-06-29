package com.nowpick.backend.store.domain;

import com.nowpick.backend.store.dto.StoreDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_store")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StoreEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storeId;
    
    @Column(name = "store_region", nullable = false)
    private String storeRegion;
    
    @Column(name = "store_name", nullable = false)
    private String storeName;
    
    @Column(name = "store_status", nullable = false)
    private String storeStatus;
    
    @Column(name = "store_address", nullable = false)
    private String storeAddress;
    
    @Column(name = "store_tel", nullable = false)
    private String storeTel;
    
    
    public StoreEntity ( StoreDTO storeDTO ) {
        this.storeRegion = storeDTO.getStoreRegion();
        this.storeName = storeDTO.getStoreName();
        this.storeStatus = storeDTO.getStoreStatus();
        this.storeAddress = storeDTO.getStoreAddress();
        this.storeTel = storeDTO.getStoreTel();
    }
}
