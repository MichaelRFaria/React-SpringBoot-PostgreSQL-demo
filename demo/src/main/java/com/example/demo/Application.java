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

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();


    // code below creates a simple service accepting HTTP GET requests at http://localhost:8080/hello and respond with a JSON representation of "Hello, World!"


    // this "annotation" ensures that HTTP GET requests to "/greeting" are mapped to the greeting() method
    @GetMapping("/greeting")

    // @RequestParam binds the value of the query string into the parameter of the greeting method. Both parameters of the annotation are optional
    public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
        return new Greeting(counter.incrementAndGet(), String.format(template, name));
    }


    // code below creates a simple "Hello, World!" endpoint at http://localhost:8080/hello


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
