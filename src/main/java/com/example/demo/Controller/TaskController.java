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

    // @GetMapping defines that the following method is used by HTTP GET requests at "/task" (receiving data)
    // example command: Invoke-RestMethod -Method GET -Uri http://localhost:8080/task
    @GetMapping("/task")
    public Iterable<Task> findAllTasks() {
        return this.taskRepository.findAll();
    }

    // @PostMapping defines that the following method is used by HTTP POST requests at "/task" (sending data)
    // example command: Invoke-RestMethod -Method POST -Uri http://localhost:8080/task -ContentType "application/json" -Body '{"title":"Work on CRUD project","description":"Finish CRUD project to build full-stack skills.","status":"Pending","dueDate":"2025-12-31"}'
    @PostMapping("/task")
    public Task addTask(@RequestBody Task task) {
        return this.taskRepository.save(task);
    }

    // @PutMapping defines that the following method is used by HTTP PUT requests at "/task/{id}" (updating data). id will the id variable of the record to update.
    // example command: Invoke-RestMethod -Method PUT -Uri http://localhost:8080/task/1 -ContentType "application/json" -Body '{"title":"Work on CRUD project","description":"Finish CRUD project to build full-stack skills.","status":"Pending","dueDate":"2025-12-31"}'
    @PutMapping("task/{id}")
    public Task updateTask(@PathVariable int id, @RequestBody Task newTask) {
        Task taskInDb = this.taskRepository.findById(id).get();
        taskInDb.setTitle(newTask.getTitle());
        taskInDb.setDescription(newTask.getDescription());
        taskInDb.setDueDate(newTask.getDueDate());
        taskInDb.setStatus(newTask.getStatus());
        return this.taskRepository.save(taskInDb);
    }

    // @DeleteMapping defines that the following method is used by HTTP DELETE requests at "/task/{id}" (deleting data). id will the id variable of the record to delete.
    // example command: Invoke-RestMethod -Method DELETE -Uri http://localhost:8080/task/1
    @DeleteMapping("task/{id}")
    public void deleteTask(@PathVariable int id) {
        this.taskRepository.deleteById(id);
    }
}
