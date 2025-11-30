import '../styles/Tasks.css'
import {useEffect, useState} from "react";
import {comparePriority, convertDate, daysRemaining} from "../utils/utilFuncs";

// simple component that displays an HTML list of tasks from a given tasks prop
export default function Tasks({tasks, sortValue, searchValue, filterConstraints}) {
    const [listOfTasks, setListOfTasks] = useState([]);
    // we need the date to filter by before due date and overdue.
    const [localDate, setLocalDate] = useState("");

    // obtaining the current date
    useEffect(() => {
        // we create a new date object (dd/mm/yyyy) then replace the '/' with '-' (dd-mm-yyyy) then we reverse the order (yyyy-mm-dd)
        // so now it matches the dates in the database allowing us to compare dates
        setLocalDate(convertDate(new Date().toLocaleDateString().replaceAll("/", "-")));
    }, [])

    // copying the tasks passed from the parent, then filtering and sorting the tasks
    useEffect(() => {
        let updatedList = [...tasks]; // copy to prevent mutation ("Changing an existing object or array in place instead of creating a new one.")

        // searching
        updatedList = updatedList.filter(task => {
            return ((task.title).includes(searchValue) || (task.description).includes(searchValue));
        })

        // filtering
        updatedList = updatedList.filter(task => {
            if (!filterConstraints.completed && task.status === "Completed") {
                return false;
            }

            if (!filterConstraints.uncompleted && task.status !== "Completed") {
                return false;
            }

            if (!filterConstraints.started && task.startDate >= localDate) {
                return false;
            }

            if (!filterConstraints.notStarted && task.startDate < localDate) {
                return false;
            }

            if (!filterConstraints.beforeDueDate && task.dueDate >= localDate) {
                return false;
            }

            if (!filterConstraints.overdue && task.dueDate < localDate) {
                return false;
            }

            return true;
        })

        // sorting
        updatedList.sort((a, b) => {
            // sorting based on the selected property to sort by
            if (typeof a[sortValue] === "number") {
                return a[sortValue] - b[sortValue];
            }

            if (typeof a[sortValue] === "string") {
                if (sortValue === "priority") {
                    return comparePriority(a[sortValue], b[sortValue]);
                }

                // JS string method to compare two strings, returns -1, 0, 1 (before, equal, after)
                return a[sortValue].localeCompare(b[sortValue]);
            }
        })

        setListOfTasks(updatedList);
    }, [tasks, filterConstraints, sortValue, searchValue]);

    return (
        <div id={"displayedTasks"}>
            <h3>Your tasks:</h3>

            {tasks.length !== 0 ? (
                <div id="table">
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Start Date</th>
                            <th>Due Date</th>
                            <th>Days until Start</th>
                            <th>Days until Due</th>
                        </tr>
                        {listOfTasks.map(task =>
                            <tr>
                                <td>{task.id}</td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.status}</td>
                                <td>{task.priority}</td>
                                <td>{convertDate(task.startDate)}</td>
                                <td>{convertDate(task.dueDate)}</td>
                                <td>{daysRemaining(task.startDate, "start")}</td>
                                <td>{daysRemaining(task.dueDate, "due")}</td>
                            </tr>)}
                    </table>
                </div>
            ) : (
                <p>You have no tasks!</p>
            )}
        </div>
    )
}