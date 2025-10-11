package com.example.demo.Controller;

import com.example.demo.Entity.Task;
import com.example.demo.Repo.TaskRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// @RestController contains handler methods for REST endpoints
@RestController
public class TaskController {
    private final TaskRepository taskRepository;

    TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // @GetMapping defines that the following method use HTTP GET request at "/task" (receiving data)
    @GetMapping("/task")
    public Iterable<Task> findAllTasks() {
        return this.taskRepository.findAll();
    }

    // curl.exe http://localhost:8080/task

    // @PostMapping defines that the following method use HTTP POST request at "/task" (sending data)
    @PostMapping("/task")
    public Task addTask(@RequestBody Task task) {
        return this.taskRepository.save(task);
    }

    // curl.exe -X POST http://localhost:8080/task -H "Content-Type: application/json" -d '{\"title\":\"title\",\"description\":\"description\",\"status\":\"status\",\"dueDate\":\"2025-10-10\"}'
    // have to escape double quotes????
}
