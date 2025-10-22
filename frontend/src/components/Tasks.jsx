// simple method to display the tasks retrieved from the backend
export default function Tasks({tasks}) {
    // React has no clue how to display an object, so we need to map the object, to something that React can recognise
    // in this case it's the data members of the Task object, which consist of: Integer, String, and LocalDate, which React understands
    const listOfTasks = tasks.map(task =>
        // you must specify a key for React's DOM to be able to figure out which elements have been updated, so it can rerender the list properly
        <li key={task.id}>{task.id} | {task.title} | {task.description} | {task.status} | {task.dueDate}</li>
    )

    return <ul>{listOfTasks}</ul>
}