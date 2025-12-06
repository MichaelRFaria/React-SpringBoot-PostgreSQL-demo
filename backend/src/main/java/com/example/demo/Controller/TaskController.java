package com.example.demo.Controller;

import com.example.demo.Entity.Task;
import com.example.demo.Repo.TaskRepository;
import org.springframework.web.bind.annotation.*;

// the browser by default blocks requests from different origins by default for security reasons (Same-Origin policy)
// this enables "Cross-Origin resource sharing" telling Spring Boot, its okay if the requests come from the following origin
@CrossOrigin(origins="http://localhost:3000")
// @RestController contains handler methods for REST endpoints
@RestController
public class TaskController {
    private final TaskRepository taskRepository;

    TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // @GetMapping defines that the following method is used by HTTP GET requests at "task" (receiving data)
    // example command: Invoke-RestMethod -Method GET -Uri http://localhost:8080/task
    @GetMapping("task")
    public Iterable<Task> findAllTasks() {
        return this.taskRepository.findAll();
    }

    // @GetMapping defines that the following method is used by HTTP GET requests at "task/{id}" (receiving data). id is the id variable of the record to receive.
    // example command: Invoke-RestMethod -Method GET -Uri http://localhost:8080/task/1
    @GetMapping("task/{id}")
    public Task findTaskById(@PathVariable Integer id) {
        return this.taskRepository.findById(id).get();
    }

    // @PostMapping defines that the following method is used by HTTP POST requests at "task" (sending data)
    // example command: Invoke-RestMethod -Method POST -Uri http://localhost:8080/task -ContentType "application/json" -Body '{"title":"Work on CRUD project","description":"Finish CRUD project to build full-stack skills.","status":"Pending","dueDate":"2025-12-31"}'
    @PostMapping("task")
    public Task addTask(@RequestBody Task task) {
        return this.taskRepository.save(task);
    }

    // @PutMapping defines that the following method is used by HTTP PUT requests at "task/{id}" (updating data). id is the id variable of the record to update.
    // example command: Invoke-RestMethod -Method PUT -Uri http://localhost:8080/task/1 -ContentType "application/json" -Body '{"title":"Work on CRUD project","description":"Finish CRUD project to build full-stack skills.","status":"Pending","dueDate":"2025-12-31"}'
    @PutMapping("task/{id}")
    public Task updateTask(@PathVariable int id, @RequestBody Task newTask) {
        Task taskInDb = this.taskRepository.findById(id).get();
        taskInDb.setTitle(newTask.getTitle());
        taskInDb.setDescription(newTask.getDescription());
        taskInDb.setStatus(newTask.getStatus());
        taskInDb.setPriority(newTask.getPriority());
        taskInDb.setStartDate(newTask.getStartDate());
        taskInDb.setDueDate(newTask.getDueDate());
        return this.taskRepository.save(taskInDb);
    }

    // @DeleteMapping defines that the following method is used by HTTP DELETE requests at "task/{id}" (deleting data). id is the id variable of the record to delete.
    // example command: Invoke-RestMethod -Method DELETE -Uri http://localhost:8080/task/1
    @DeleteMapping("task/{id}")
    public void deleteTask(@PathVariable int id) {
        this.taskRepository.deleteById(id);
    }

    @DeleteMapping("task")
    public void deleteAllTasks() {this.taskRepository.deleteAll();}
}
