package com.nowpick.backend.store.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StoreDTO {
    
    private String storeRegion;
    private String storeName;
    private String storeStatus;
    private String storeAddress;
    private String storeTel;
}
