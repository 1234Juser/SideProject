package com.nowpick.backend.config;

import com.nowpick.backend.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
// ⭐ @Profile("!test")를 추가하여 테스트 환경에서는 실행되지 않도록 할 수 있습니다. ⭐
// 프로덕션 환경에서만 초기 데이터 로딩이 필요하다면 더욱 유용합니다.
// spring.profiles.active=test 또는 spring.main.web-application-type=none 등으로 테스트 시 비활성화 가능
@Profile("!test")   // test 프로파일에서는 이 Runner를 비활성화 (선택 사항)
public class DataInitializer implements CommandLineRunner {
    
    private final StoreService storeService;
    
    @Override
    public void run(String... args) throws Exception {
        log.info("애플리케이션 시작 시 데이터 초기화 검사...");
        
        if (!storeService.isStoreDataPresent()) {
            log.info("DB에 매장 데이터가 없습니다. 스크래핑 및 초기 데이터 저장을 시작합니다.");
            storeService.saveScrapedStores();
            log.info("초기 데이터 저장 완료");
        } else {
            log.info("DB에 이미 매장 데이터가 존재합니다. 스크래핑 및 초기 데이터 저장을 건너뜁니다.");
        }
    }
}
