package com.example.serverproject;

import com.example.serverproject.enemeration.Status;
import com.example.serverproject.model.Server;
import com.example.serverproject.repository.ServerRepository;
import com.example.serverproject.service.ServerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String[] STATUS_OPTIONS = {"SERVER_UP", "SERVER_DOWN"};

    @Autowired
    private ServerRepository serverRepository;

    @Override
    public void run(String... args) throws Exception {
        createServers();
    }

    private void createServers() {
        Random random = new Random();
        for (int i = 0; i < 300; i++) {
            Server server = new Server();
            server.setIpAddress("192.168.1." + random.nextInt(100, 999)+ random.nextInt(100,999));
            server.setName("Ubunto Linux");
            server.setImageUrl("http://localhost:8080/server/image/server" + random.nextInt(1, 6) + ".png");
            server.setMemory(random.nextInt(10, 99) + "GB");
            server.setType("Mac User" + random.nextInt(1000, 9999));
            server.setStatus(Status.SERVER_DOWN);
            serverRepository.save(server);
        }

//        serverRepository.save(new Server(null, "192.168.1.160", "Ubunto Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server1.png", Status.SERVER_UP));
//        serverRepository.save(new Server(null, "192.168.1.163", "Mac Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server2.png", Status.SERVER_DOWN));
//        serverRepository.save(new Server(null, "192.168.1.15", "Window Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server3.png", Status.SERVER_UP));
//        serverRepository.save(new Server(null, "192.168.1.001", "Window Linux", "16 GB", "Gaming", "http://localhost:8080/server/image/server4.png", Status.SERVER_DOWN));
//        serverRepository.save(new Server(null, "192.168.1.065", "HongMeng OS", "133 GB", "office", "http://localhost:8080/server/image/server4.png", Status.SERVER_UP));
    }
}
