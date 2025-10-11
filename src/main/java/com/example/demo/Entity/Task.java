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

    private LocalDate dueDate;

    // Hibernate (the Java library that handles all this database communication) expects a constructor with no arguments.
    protected Task() {}

    public Task(String title, String description, String status, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
    }


    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }
}
