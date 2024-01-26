package com.example.serverproject;

import com.example.serverproject.enemeration.Status;
import com.example.serverproject.model.Server;
import com.example.serverproject.repository.ServerRepository;
import com.github.javafaker.Faker;
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
        Faker faker = new Faker();
        serverRepository.save(new Server(null, "10.1.20.166", "Ubunto Linux", "16 GB", "Personal PC", "http://localhost:8080/server/image/server1.png", Status.SERVER_UP));

        Random random = new Random();

        for (int i = 0; i < 200; i++) {
            int randomIndex = random.nextInt(2);
            Server server = new Server();
            server.setIpAddress(faker.internet().publicIpV4Address());
            server.setName(faker.name().fullName());
            server.setImageUrl(faker.internet().image());
            server.setMemory(random.nextInt(10, 99) + " GB");
            server.setType(faker.name().title());
            server.setStatus(Status.valueOf(STATUS_OPTIONS[randomIndex]));
            serverRepository.save(server);
        }
    }
}
