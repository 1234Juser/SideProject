package com.nowpick.backend.store.controller;

import com.nowpick.backend.store.dto.StoreDTO;
import com.nowpick.backend.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
@Slf4j
public class StoreController {
    
    private final StoreService storeService;
    
    
    // 스크래핑 실행
    @GetMapping("/")
    public ResponseEntity<String> startScraping() {
        new Thread(() -> storeService.saveScrapedStores()).start();
        return ResponseEntity.status(HttpStatus.OK).body("Scraping started in background. Check logs for progress.");
    }
    
    
    @GetMapping("/scrape")
    public List<StoreDTO> getStores() {
        
        try {
            return storeService.scrapeStores();
        } catch (Exception e){
            throw new RuntimeException("스크래핑 중 오류 발생", e);
        }
        
    }
}
