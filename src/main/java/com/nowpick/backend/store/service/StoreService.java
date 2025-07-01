package com.nowpick.backend.store.service;

import com.nowpick.backend.store.domain.StoreEntity;
import com.nowpick.backend.store.dto.KakaoGeoResponse;
import com.nowpick.backend.store.dto.StoreDTO;
import com.nowpick.backend.store.repo.StoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class StoreService {
    
    private static final String BASE_URL = "https://www.hollys.co.kr/store/korea/korStore2.do";
    private static final int MAX_PAGE = 13;     // 서울 지역의 총 페이지 수
    
    private final StoreRepository storeRepository;
    private final KakaoMapService kakaoMapService;
    
    
    
    // 할리스 커피 매장 정보 스크래핑
    public List<StoreDTO> scrapeStores() {
        
        List<StoreDTO>  stores = new ArrayList <>();
        log.info("할리스 매장 정보 스크래핑 시작...");
        
        
        for (int pageNo = 1; pageNo <= MAX_PAGE; pageNo ++) {
            String url = BASE_URL + "?pageNo=" +pageNo + "&sido=%EC%84%9C%EC%9A%B8&gugun=&store=";
            log.debug("스크래핑 url 확인 : {}", url);
            
            try {
                    // 1. 웹 페이지에 연결해서 Document  객체 가져오기 (Document- HTML 전체 문서)
                    Document document = Jsoup
                                        .connect(url)
                                        .timeout(10 * 1000)     // 10초 타임아웃
                                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")       // 봇으로 인식되지 않도록 User-Agent 설정
                                        .get();
                    
                    // 2. 매장 정보가 담긴 테이블의 tbody 찾기
                    Element tbody = document.selectFirst("table.tb_store tbody");
                    
                    if (tbody == null) {
                        log.error("Error: tbody를 찾을 수 없습니다. 페이지: {}", pageNo);
                        continue;
                    }
                    
                    // 3. tbody 안의 모든 <tr> 요소 찾기
                    Elements storeRows = tbody.select("tr");
                    log.debug("페이지 {}에서 {}개의 매장 행 발견.", pageNo, storeRows.size());
                    
                    for (Element row : storeRows) {
                            // 4. 각 <tr> 안의 <td> 요소들에서 데이터 추출
                            Elements cols = row.select("td");
                            log.info("cols 확인 : {}", cols);
                            
                            if (cols.size() >= 6) {
                                String storeRegion = cols.get(0).text();
                                String storeName = cols.get(1).text();
                                String storeStatus = cols.get(2).text();
                                String storeAddress = cols.get(3).text();
                                String storeTel = cols.get(5).text();       // 전화번호는 6번째 (index 5)
                                
        //                        stores.add(new StoreDTO(storeRegion, storeName, storeStatus, storeAddress, storeTel));
                                StoreDTO store = new StoreDTO(storeRegion, storeName, storeStatus, storeAddress, storeTel);
                                log.debug("추출한 데이터로 dto 생성 확인하기 : {}", store);
                                
                                stores.add(store);
                            }  else {
                                log.warn("매장 정보를 추출할 수 없는 행 발견 (컬럼 수 부족): {}", row.html());
                            }
                        }
            } catch (IOException e) {
                log.error("페이지 {} 스크래핑 중 I/O 오류 발생: {}", pageNo, e.getMessage());
            }  catch (Exception e) {
                log.error("페이지 {} 스크래핑 중 예상치 못한 오류 발생: {}", pageNo, e.getMessage(), e);  // 스택 트레이스와 함께 에러 로그
            }
            
            // 너무 빠르게 요청하지 않도록 딜레이 추가 (선택 사항이지만 권장)
            try {
                Thread.sleep(500); // 0.5초 대기
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Scraping interrupted.");
                break;
            }
        }
        
        log.info("할리스 매장 정보 스크래핑 완료. 총 {}개의 매장 정보 수집.", stores.size());
        return stores;
    }
    
    
    // 스크래핑한 데이터를 DB로 저장
    @Transactional
    public void saveScrapedStores() {
        log.info("### 매장 스크래핑 및 DB 저장 프로세스 시작 ###");
        List<StoreDTO> scrapedStores = scrapeStores();
        
        int savedCount = 0;
        int skippedCount = 0;
        int geocodedCount = 0;
        
        for (StoreDTO dto : scrapedStores) {
            
            // 중복 데이터 방지 (매장명과 주소가 동일하면 중복으로 간주)
            if (! storeRepository.existsByStoreNameAndStoreAddress(dto.getStoreName(), dto.getStoreAddress())) {
                
                try {
                    // KakaoMapService로 지오코딩 수행
                    KakaoGeoResponse geoResponse = kakaoMapService.getCoordinatesFromAddress(dto.getStoreAddress());
                    
                    // ⭐ 여기서 geoResponse.getDocuments()를 통해 List<Document>를 얻습니다. ⭐
                    if (geoResponse != null && geoResponse.getDocuments() != null && !geoResponse.getDocuments().isEmpty()) {
                        KakaoGeoResponse.Document document = geoResponse.getDocuments().get(0);
                        dto.setLongitude(Double.parseDouble(document.getX()));
                        dto.setLatitude(Double.parseDouble(document.getY()));
                        geocodedCount++;
                        log.debug("지오코딩 성공 -> 위도 {}, 경도 {} ", dto.getLatitude(), dto.getLongitude());
                    } else {
                        log.warn("지오코딩 실패 또는 결과 없음: {}\", dto.getStoreAddress()");
                    }
                } catch (Exception e) {
                    log.error("지오코딩 중 에러 발생 (주소: {}): {}", dto.getStoreAddress(), e.getMessage());
                }
                
                StoreEntity store = new StoreEntity(dto);       // StoreDTO를 StoreEntity로 변환.
                storeRepository.save(store);
                savedCount++;
                log.debug("DB에 새 매장 저장 완료: {}", dto.getStoreName());
                
            }  else {
                skippedCount++;
                log.debug("중복 매장 발견, 건너뜀: {}", dto.getStoreName());
            }
        }
        
        log.info("### 스크래핑 및 DB 저장 완료. 총 처리 매장 수: {}, 새로 저장된 매장 수: {}, 건너뛴 매장 수: {} ###",
                 scrapedStores.size(), savedCount, skippedCount);
    }
    
    
    /*
    // 매일 새벽 3시에 스크래핑 및 DB 저장 실행 ( → 스케줄러를 통해 주기적으로 실행. 메인 어플리케이션에 스케줄링 활성화 어노테이션 추가)
    // @Scheduled(cron = "0 0 3 * * ?") // 초 분 시 일 월 요일
    
    // ⭐ 테스트를 위해 잠시 fixedDelay로 변경 ⭐
    // 애플리케이션 시작 후 5초(5000ms) 후에 한 번 실행
    // 이 후에는 saveScrapedStoresToDb() 메서드 완료 후 24시간(1일) 뒤에 재실행되도록 설정
    @Scheduled(initialDelay = 5000, fixedDelay = 24 * 60 * 60 * 1000) // 5초 후 첫 실행, 이후 24시간마다 실행 */
    public void scheduleScrapingAndSaving() {
        log.info("### 예약된 스크래핑 및 DB 저장 프로세스 시작 ###");
        saveScrapedStores();
        log.info("### 예약된 스크래핑 및 DB 저장 프로세스 완료 ###");
    }
    
    // ⭐ 추가: DB에 매장 데이터가 존재하는지 확인하는 메서드 ⭐
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션으로 설정
    public boolean isStoreDataPresent() {
        return storeRepository.count() > 0; // DB에 저장된 StoreEntity가 1개 이상인지 확인
    }
    
    
    // 매장 전체 조회
    public List<StoreDTO> getAllStores() {
        
        List<StoreEntity> storeEntityList = storeRepository.findAll();
        List<StoreDTO> storeList = storeEntityList.stream()
                                                  .map(store -> new StoreDTO(store))
                                                  .toList();
        log.info("매장 전체 조회 : {}", storeList);
        
        return storeList;
    }
    
    
    // 지구상의 두 지점 간 거리를 계산하는 Haversine 공식 (유지)
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // ... (기존 코드) ...
        final int R = 6371; // 지구 반지름 (킬로미터)
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                   + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                     * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // 거리 (km)
    }
    
    
    // 매장 전체 조회 (거리 정렬 포함)
    public List<StoreDTO> getAllStoresOrderByDistance(Double userLat, Double userLon) {
        
        List<StoreEntity> storeEntityList = storeRepository.findAll();
        List<StoreDTO> storeList = storeEntityList.stream()
                                   .map(store -> {
                                       StoreDTO dto = new StoreDTO(store);
                                       if (store.getLatitude() != null && store.getLongitude() != null && userLat != null && userLon != null) {
                                           double distance = calculateDistance(userLat, userLon, store.getLatitude(), store.getLongitude());        // 사용자의 현재 위치와 매장의 위치 간의 거리를 계산
                                           dto.setDistance(distance);
                                       }
                                       return dto;
                                   })
                                   .sorted(Comparator.comparing(StoreDTO::getDistance, Comparator.nullsLast(Double::compareTo)))
                                   // StoreDTO 목록을 distance 필드를 기준으로 오름차순 정렬합니다. (거리가 가까울수록 먼저 오도록)
                                   // nullsLast는 distance가 null(예: 지오코딩 실패)인 경우 맨 뒤로 보냄
                                   .toList();
        
        log.info("매장 전체 조회 (거리 정렬): {}", storeList);
        return storeList;
    }
    
}
