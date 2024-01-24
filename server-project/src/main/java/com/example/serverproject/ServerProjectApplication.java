package com.example.serverproject;

import com.example.serverproject.enemeration.Status;
import com.example.serverproject.model.Server;
import com.example.serverproject.repository.ServerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication
public class ServerProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerProjectApplication.class, args);
    }

    @Bean
    CommandLineRunner run(ServerRepository serverRepository) {
        return args -> {
            serverRepository.save(new Server(null, "192.168.1.160", "Ubunto Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server1.png", Status.SERVER_UP));
            serverRepository.save(new Server(null, "192.168.1.163", "Mac Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server2.png", Status.SERVER_DOWN));
            serverRepository.save(new Server(null, "192.168.1.15", "Window Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server3.png", Status.SERVER_UP));
            serverRepository.save(new Server(null, "192.168.1.001", "Window Linux", "16 GB", "Gaming", "http://localhost:8080/server/image/server4.png", Status.SERVER_DOWN));
            serverRepository.save(new Server(null, "192.168.1.065", "HongMeng OS", "133 GB", "office", "http://localhost:8080/server/image/server4.png", Status.SERVER_UP));
        };
    }


    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:4300", "http://localhost:4200" ));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
                "Accept", "Jwt-Token", "Authorization", "Origin. Accept", "X-Requested-With",
                "Access-Control-Request-Method", "Access-Control-Request-Headers" ));
        corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Access", "Jwt-Token", "Authorization",
                "Access-Control Allow-Method", "Access-Control-Allow-Origin", "Access-Control-Access-Credentials", "Filename" ));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" ));
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

}
