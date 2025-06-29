package com.nowpick.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class NowpickApplication {
    
    public static void main ( String[] args ) {
        SpringApplication.run (NowpickApplication.class, args);
    }
    
/*    @Bean
    public CommandLineRunner runner( PasswordEncoder passwordEncoder) {
        return args -> {
            String encoded = passwordEncoder.encode("admin03");
            System.out.println("admin 암호화: " + encoded);
            
            String encodedUser = passwordEncoder.encode("user03");
            System.out.println("user 암호화: " + encodedUser);
        };
    }
    */
}
