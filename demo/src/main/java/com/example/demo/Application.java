package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

@SpringBootApplication

// HTTP requests are handled by a controller, this tells Spring that this code describes an endpoint that should be made available over the web
@RestController
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
