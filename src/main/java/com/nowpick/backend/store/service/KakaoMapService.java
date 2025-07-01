package com.nowpick.backend.store.service;

import com.nowpick.backend.store.dto.KakaoGeoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoMapService {
    
    private final RestTemplate restTemplate;
    
    
    
    // 매장 주소로 위도랑 경도 가져오는 메서드
    public KakaoGeoResponse getCoordinatesFromAddress( String address) {
        
            // 주소 검색 URL 및 쿼리 파라미터 생성
            String apiUrl = "https://dapi.kakao.com/v2/local/search/address.json";
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl).queryParam("query", address);
            
            // RequestEntity를 사용하여 GET 요청 객체 생성
            RequestEntity<Void> requestEntity = new RequestEntity <>(HttpMethod.GET, builder.build().toUri());
            
            // API 호출
            try {
                // 첫 번째 인자는 RequestEntity, 두 번째 인자는 응답 본문을 매핑할 클래스 타입입니다.
                ResponseEntity<KakaoGeoResponse> responseEntity = restTemplate.exchange(requestEntity, KakaoGeoResponse.class);
                
                // HTTP 상태 코드가 2xx (성공) 일 시 응답 본문 반환
                if (responseEntity.getStatusCode().is2xxSuccessful()) {
                    log.info("카카오맵 지오코딩 API 호출 성공. 응답: {}", responseEntity.getBody());
                    return responseEntity.getBody();
                } else {
                    log.error("카카오맵 지오코딩 API 응답 실패: 상태 코드 {}, 응답 본문: {}", responseEntity.getStatusCode(), responseEntity.getBody());
                    return null;
                }
                
            } catch (RestClientException e) {
                log.error("카카오맵 지오코딩 API 호출 중 예외 발생 : {}", e.getMessage(), e);
                return null;
                
            }

    }
    
    
}
