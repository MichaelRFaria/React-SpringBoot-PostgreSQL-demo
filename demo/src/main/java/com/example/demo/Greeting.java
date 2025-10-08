package com.example.demo;

// this is a resource representation class, Spring will automatically turn instances of these classes into JSON
public record Greeting(long id, String content) {}

// our web service will handle GET requests for /hello, optionally with a name parameter in the query string.
// The GET request should return a 200 OK response with JSON in the body that represents a greeting.
// It should resemble the following output:

//{
//        "id": 1,
//        "content": "Hello, World!"
//}
