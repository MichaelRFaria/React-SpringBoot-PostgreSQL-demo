package com.example.demo.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

// @Entity is used to denote that this class describes an entity of a table.
// An instance of an entity in a table is one row of the table.
@Entity

// @Table is used to overwrite the default table name, (which is the name of the class by default???)
@Table(name = "tasks")
public class Task {

    // @Id is used to define the primary key of the table
    @Id
    // @GeneratedValue is used in conjunction with the @Id annotation to dictate how to generate primary keys.
    @GeneratedValue
    private Integer id;

    private String title;

    private String description;

    private String status;

    private String priority;

    private LocalDate startDate;

    private LocalDate dueDate;

    // Hibernate (the Java library that handles all this database communication) expects a constructor with no arguments.
    protected Task() {}

    public Task(String title, String description, String status, String priority, LocalDate startDate, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.startDate = startDate;
        this.dueDate = dueDate;
    }


    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
