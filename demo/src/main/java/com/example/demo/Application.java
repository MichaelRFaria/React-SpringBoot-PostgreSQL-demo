package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController // tells Spring that this code describes an endpoint that should be made available over the web
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

    // this line of code is an "annotation", this @GetMapping essentially will execute the method below to the address allocated in the param,
    // (http://localhost:8080/hello) in this case. an empty string ("") would send the request to http://localhost:8080
    // Specifically: tells Spring to use our hello() method to answer requests that get sent to the http://localhost:8080/hello address
    @GetMapping("/hello")

    // method to take a String param called name and combine it with "Hello " to make an appropriate response
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) { // tells Spring to expect a name value in the request, but if it's not there, use the "World" by default
        return String.format("Hello %s!", name);
        // right now it there is no way to add a name, but loading http://localhost:8080/hello?name=Michael, will update the name accordingly
    }
}
