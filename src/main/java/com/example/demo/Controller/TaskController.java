package com.example.demo.Controller;

import com.example.demo.Entity.Task;
import com.example.demo.Repo.TaskRepository;
import org.springframework.web.bind.annotation.*;

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

    // curl.exe -X GET http://localhost:8080/task

    // @PostMapping defines that the following method use HTTP POST request at "/task" (sending data)
    @PostMapping("/task")
    public Task addTask(@RequestBody Task task) {
        return this.taskRepository.save(task);
    }

    // curl.exe -X POST http://localhost:8080/task -H "Content-Type: application/json" -d '{\"title\":\"Work on CRUD project\",\"description\":\"Finish CRUD project to build full-stack skills.\",\"status\":\"Pending\",\"dueDate\":\"2025-12-31\"}'
    // have to escape double quotes???? (probably a powershell only thing)
    // -X specifies HTTP method
    // -H specifies the Header
    // -d specifies the data


    // @PutMapping defines that the following method use HTTP PUT request at "/task/{id}" (updating data), id will the id variable of the record to delete.
    @PutMapping("task/{id}")
    public Task updateTask(@PathVariable int id, @RequestBody Task newTask) {
        Task taskInDb = this.taskRepository.findById(id).get();
        taskInDb.setTitle(newTask.getTitle());
        taskInDb.setDescription(newTask.getDescription());
        taskInDb.setDueDate(newTask.getDueDate());
        taskInDb.setStatus(newTask.getStatus());
        return this.taskRepository.save(taskInDb);
    }

    // Invoke-RestMethod -Uri http://localhost:8080/task/2 -Method PUT -ContentType "application/json" -Body '{"title":"title2","description":"new description","status":"status","dueDate":"2025-10-10"}'

    @DeleteMapping("task/{id}")
    public void deleteTask(@PathVariable int id) {
        this.taskRepository.deleteById(id);
    }
}
