package com.nowpick.backend.store.dto;

import lombok.*;
import org.springframework.data.jpa.repository.query.Meta;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class KakaoGeoResponse {
    
    private List<Document> documents;
    private Meta meta;
    
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Document {
        private String address_name;
        private String address_type;
        private String x;       // 경도 (longitude)
        private String y;       // 위도 (latitude)
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Meta {
        private Integer total_count;
        private Integer pageable_count;
        private Boolean is_end;
    }
}
