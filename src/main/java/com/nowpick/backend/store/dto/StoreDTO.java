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
    private Double latitude;        // 위도
    private Double longitude;       //경도
    private Double distance;        // 사용자 위치로부터의 거리
    
    
    public StoreDTO( StoreEntity storeEntity ) {
        this.storeId = storeEntity.getStoreId();
        this.storeRegion = storeEntity.getStoreRegion();
        this.storeName = storeEntity.getStoreName();
        this.storeStatus = storeEntity.getStoreStatus();
        this.storeAddress = storeEntity.getStoreAddress();
        this.storeTel = storeEntity.getStoreTel();
        // ⭐ StoreEntity에 latitude, longitude 필드가 있다면 여기서 설정 ⭐
        this.latitude = storeEntity.getLatitude();
        this.longitude = storeEntity.getLongitude();
        // this.distance = storeEntity.getDistance(); // StoreEntity에 distance 필드가 없다면 주석 처리
    }
    
    // 서비스의 scrapeStores메서드에서 사용됨
    public StoreDTO(String storeRegion, String storeName, String storeStatus, String storeAddress, String storeTel) {
        this.storeRegion = storeRegion;
        this.storeName = storeName;
        this.storeStatus = storeStatus;
        this.storeAddress = storeAddress;
        this.storeTel = storeTel;
        // latitude, longitude는 기본값(null)으로 초기화되거나, 나중에 geocoding을 통해 설정됩니다.
        // 스크래핑 시에는 위도/경도를 알 수 없으므로 이 생성자에서는 설정하지 않습니다.
        // this.latitude = null; // 명시적으로 null로 초기화하고 싶다면 추가
        // this.longitude = null; // 명시적으로 null로 초기화하고 싶다면 추가
    }
    
    // (선택 사항) 거리를 위한 Setter 추가 - @Setter가 있으므로 필요 없을 수 있습니다.
    // public void setDistance(Double distance) {
    //     this.distance = distance;
    // }
}
