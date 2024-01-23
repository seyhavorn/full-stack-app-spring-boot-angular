package com.example.serverproject;

import com.example.serverproject.enemeration.Status;
import com.example.serverproject.model.Server;
import com.example.serverproject.repository.ServerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ServerProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerProjectApplication.class, args);
    }

    @Bean
    CommandLineRunner run(ServerRepository serverRepository) {
        return args -> {
            serverRepository.save(new Server(null, "192.168.1.160", "Ubunto Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server1.png", Status.SERVER_UP));
            serverRepository.save(new Server(null, "192.168.1.163", "Mac Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server2.png", Status.SERVER_UP));
            serverRepository.save(new Server(null, "192.168.1.15", "Window Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server3.png", Status.SERVER_UP));
            serverRepository.save(new Server(null, "192.168.1.001", "Window Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server4.png", Status.SERVER_UP));
        };
    }
}
