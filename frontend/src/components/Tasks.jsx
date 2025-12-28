import {useEffect, useState} from "react";
import {comparePriority, convertDate, convertDateToReadable, daysRemaining} from "../utils/utilFuncs";
import '../styles/Tasks.css'

// component that displays a table of tasks from the database
export default function Tasks({tasks, sortValue, searchValue, filterConstraints}) {
    const [listOfTasks, setListOfTasks] = useState([]);
    const [localDate, setLocalDate] = useState(""); // we need the date to filter out tasks that are before the due date or overdue
    const [hiddenColumns, setHiddenColumns] = useState({
        id: false,
        title: false,
        description: false,
        status: false,
        priority: false,
        startDate: false,
        dueDate: false,
        daysUntilStart: false,
        daysUntilDue: false
    })

    // obtaining the current date
    useEffect(() => {
        // we create a new date object (dd/mm/yyyy) then replace the '/' with '-' (dd-mm-yyyy) then we reverse the order (yyyy-mm-dd)
        // so now it matches the formats of the dates in the database (also yyyy-mm-dd) allowing us to compare today with a task's start/due date
        setLocalDate(convertDate(new Date().toLocaleDateString().replaceAll("/", "-")));
    }, [])

    // copying the tasks passed from the parent, then filtering and sorting the tasks
    useEffect(() => {
        let updatedList = [...tasks];

        // searching
        updatedList = updatedList.filter(task => {
            // if the task's title or description includes the input in the search bar, we keep it
            return ((task.title).includes(searchValue) || (task.description).includes(searchValue));
        })

        // filtering
        updatedList = updatedList.filter(task => {
            if (!filterConstraints.completed && task.status === "Completed") {
                return false;
            }

            else if (!filterConstraints.uncompleted && task.status !== "Completed") {
                return false;
            }

            else if (!filterConstraints.started && task.startDate <= localDate) {
                return false;
            }

            else if (!filterConstraints.notStarted && task.startDate > localDate) {
                return false;
            }

            else if (!filterConstraints.beforeDueDate && task.dueDate >= localDate) {
                return false;
            }

            else if (!filterConstraints.overdue && task.dueDate < localDate) {
                return false;
            }

            return true;
        })

        // sorting
        updatedList.sort((a, b) => {
            // sorting based on the selected property to sort by
            if (typeof a[sortValue] === "number") { // if we are sorting via a number (e.g. ID) we can use arithmetic
                return a[sortValue] - b[sortValue];
            }

            if (typeof a[sortValue] === "string") { // if we are sorting by a string (e.g. title, description) we can compare the strings lexicographically
                if (sortValue === "priority") { // special case: priority can't be compared lexicographically, so we call a helper function that correctly compares "High", "Medium" and "Low"
                    return comparePriority(a[sortValue], b[sortValue]); // returns negative if a is less than b, zero if a and b are equal, and positive if a is greater than b
                }

                // JS string method to lexicographically compare two strings, returns -1, 0, 1 (before, equal, after)
                return a[sortValue].localeCompare(b[sortValue]);
            }
        })

        setListOfTasks(updatedList);
    }, [tasks, filterConstraints, sortValue, searchValue]);

    // toggling a column's visibility
    const toggleColumnVisibility = (key) => {
        // copy the previous state, and flip the value of the given key
        setHiddenColumns(prevState => ({...prevState, [key]: !prevState[key]}));
    }

    // function that either hides or displays a table cell's text content based on whether the column's visibility
    // every <td> tag (table cell) uses this function for its text content
    const columnValue = (key, field) => hiddenColumns[key] ? "..." : field;

    // simple JS objects to determine css style to use based on task's status/priority
    // the table's status and priority columns use this
    const statusStyling = {"Completed": "status-completed", "Pending": "status-pending", "On Hold": "status-on-hold"};
    const priorityStyling = {"High": "priority-high", "Medium": "priority-medium", "Low": "priority-low"}

    return (
        <div id={"displayedTasks"}>
            <h3>Your tasks:</h3>

            {(tasks.length === 0) ? ( // if there are no tasks in the database
                <p>You have no tasks!</p>
            ) : (listOfTasks.length === 0) ? ( // if there are no tasks adhering to the current: searching and filtering criteria
                <p>You have no tasks that meet the current filter!</p>
            ) : ( // otherwise display the table of tasks
                <div id="table">
                    <table>
                        <thead>
                        <tr>
                            <th onClick={() => toggleColumnVisibility("id")}>{columnValue("id", "ID")}</th>
                            <th onClick={() => toggleColumnVisibility("title")}>{columnValue("title", "Title")}</th>
                            <th onClick={() => toggleColumnVisibility("description")}>{columnValue("description", "Description")}</th>
                            <th onClick={() => toggleColumnVisibility("status")}>{columnValue("status", "Status")}</th>
                            <th onClick={() => toggleColumnVisibility("priority")}>{columnValue("priority", "Priority")}</th>
                            <th onClick={() => toggleColumnVisibility("startDate")}>{columnValue("startDate", "Start Date")}</th>
                            <th onClick={() => toggleColumnVisibility("dueDate")}>{columnValue("dueDate", "Due Date")}</th>
                            <th onClick={() => toggleColumnVisibility("daysUntilStart")}>{columnValue("daysUntilStart", "Days Until Start")}</th>
                            <th onClick={() => toggleColumnVisibility("daysUntilDue")}>{columnValue("daysUntilDue", "Days Until Due")}</th>
                        </tr>
                        </thead>

                        <tbody>
                        {listOfTasks.map(task =>
                            <tr key={task.id}>
                                <td>{columnValue("id", task.id)}</td>
                                <td>{columnValue("title", task.title)}</td>
                                <td>{columnValue("description", task.description)}</td>
                                <td className={statusStyling[task.status]}>{columnValue("status", task.status)}</td>
                                <td className={priorityStyling[task.priority]}>{columnValue("priority", task.priority)}</td>
                                <td>{columnValue("startDate", convertDateToReadable(task.startDate))}</td>
                                <td>{columnValue("dueDate", convertDateToReadable(task.dueDate))}</td>
                                <td>{columnValue("daysUntilStart", daysRemaining(task.startDate, "start"))}</td>
                                <td>{columnValue("daysUntilDue", daysRemaining(task.dueDate, "due"))}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}