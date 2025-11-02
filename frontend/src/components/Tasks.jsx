import '../styles/Tasks.css'
import {useEffect, useState} from "react";

// simple component that displays an HTML list of tasks from a given tasks prop
export default function Tasks({tasks}) {
    const [listOfTasks, setListOfTasks] = useState([]);
    const [sortValue, setSortValue] = useState("id");
    const [filterConstraints, setFilterConstraints] = useState({ completed: true, uncompleted: true, beforeDueDate: true, overDue: true});
    // we need the date to filter by before due date and overdue.
    const [localDate, setLocalDate] = useState("");

    // hook to sort tasks and map them to list items
    useEffect(() => {
        // React has no clue how to display an object, so we need to map the object, to something that React can recognise
        // in this case it's the data members of the Task object, which consist of: Integer, String, and LocalDate, which React understands
        setListOfTasks(
            // we sort the tasks, otherwise tasks will be rendered in the order that they come in from the database,
            // which should be in order of IDs, but when updating a task, it actually gets appended to the end of the database
            // note: we are mutating the tasks variable here, which does fix some ordering issues elsewhere, but could cause wider issues
            tasks.sort((a,b) => {
                // sorting based on the selected property to sort by
                if (typeof a[sortValue] === "number") {
                    return a[sortValue] - b[sortValue];
                }

                if (typeof a[sortValue] === "string") {
                    // JS string method to compare two strings, returns -1, 0, 1 (before, equal, after)
                    return a[sortValue].localeCompare(b[sortValue]);
                }
            })
                .map(task =>
                    // you must specify a key for React's DOM to be able to figure out which elements have been updated, so it can rerender the list properly
                    <li key={task.id}>{task.id} | {task.title} | {task.description} | {task.status} | {task.dueDate}</li>
                )
        )

    },[tasks, sortValue])

    useEffect(() => {
        setLocalDate(new Date().toLocaleDateString());
    },[])

    // useEffect(() => {
    //     console.log(localDate);
    // }, [localDate]);

    // function to update checkbox state object
    const handleFilter = (e) => {
        // using a callback function in the setState method will give you the previous state (can be called anything)
        // ...prevState "spreads" (copies) the old properties into a new object
        // then we add (or override if it already exists) the new object
        setFilterConstraints(prevState => ({...prevState, [e.target.name]: e.target.checked}));
    }


    return (
        <div id={"displayedTasks"}>
            <h3>Your tasks:</h3>

            <label>
                Sort Tasks:
                <select id={"sortOptions"} value={sortValue} onChange={e => setSortValue(e.target.value)}>
                    <option value="id">ID</option>
                    <option value="title">Title</option>
                    <option value="status">Status</option>
                    <option value="dueDate">Date Due</option>
                </select>
            </label>

            <p>Filter Tasks:</p>
            <label>
                Completed:
                <input type="checkbox" name="completed" checked={filterConstraints.completed} defaultChecked={true} onChange={handleFilter}/>
            </label>
            <label>
                Uncompleted:
                <input type="checkbox" name="uncompleted" checked={filterConstraints.uncompleted} defaultChecked={true} onChange={handleFilter}/>
            </label>
            <label>
                Before due date:
                <input type="checkbox" name="beforeDueDate" checked={filterConstraints.beforeDueDate} defaultChecked={true} onChange={handleFilter}/>
            </label>
            <label>
                Overdue:
                <input type="checkbox" name="overdue" checked={filterConstraints.overdue} defaultChecked={true} onChange={handleFilter}/>
            </label>

            <hr></hr>

            {tasks.length !== 0 ? (
                <ul>{listOfTasks}</ul>
            ) : (
                <p>You have no tasks!</p>
            )}
        </div>
    )
}