package com.example.demo.Repo;

import com.example.demo.Entity.Task;
import org.springframework.data.repository.CrudRepository;

// Spring Data JPA provides "repositories" that allow you to interact with PostgreSQL databases.
// We extend the "CrudRepository", which provides generic CRUD operations.
public interface TaskRepository extends CrudRepository<Task, Integer> {
}

// Full CrudRepository definition for reference:
/*
public interface CrudRepository<T, ID> extends Repository<T, ID> {
    <S extends T> S save(S entity);

    <S extends T> Iterable<S> saveAll(Iterable<S> entities);

    Optional<T> findById(ID id);

    boolean existsById(ID id);

    Iterable<T> findAll();

    Iterable<T> findAllById(Iterable<ID> ids);

    long count();

    void deleteById(ID id);

    void delete(T entity);

    void deleteAllById(Iterable<? extends ID> ids);

    void deleteAll(Iterable<? extends T> entities);

    void deleteAll();
}
*/

// Although the interfaces have no concrete implementations.
// Spring Data JPA uses code generation to create concrete implementation of these interfaces at runtime.
// Preventing the need of having to generate the implementation yourself.