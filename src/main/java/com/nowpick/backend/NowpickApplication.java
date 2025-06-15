package com.nowpick.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class NowpickApplication {
    
    public static void main ( String[] args ) {
        SpringApplication.run (NowpickApplication.class, args);
    }
    
/*    @Bean
    public CommandLineRunner runner( PasswordEncoder passwordEncoder) {
        return args -> {
            String encoded = passwordEncoder.encode("admin");
            System.out.println("admin 암호화: " + encoded);
            
            String encodedUser = passwordEncoder.encode("user");
            System.out.println("user 암호화: " + encodedUser);
        };
    }*/
    
}
