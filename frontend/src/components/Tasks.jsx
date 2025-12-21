import '../styles/Tasks.css'
import {useEffect, useState} from "react";
import {comparePriority, convertDate, convertDateToReadable, daysRemaining} from "../utils/utilFuncs";

// simple component that displays an HTML list of tasks from a given tasks prop
export default function Tasks({tasks, sortValue, searchValue, filterConstraints}) {
    const [listOfTasks, setListOfTasks] = useState([]);
    // we need the date to filter by before due date and overdue.
    const [localDate, setLocalDate] = useState("");
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

    // toggling a column's visibility
    const toggleColumnVisibility = (key) => {
        setHiddenColumns(prevState => ({...prevState, [key]: !prevState[key]}));
    }

    // if column is hidden replace with "...", otherwise display the given field
    const columnValue = (key, field) => hiddenColumns[key] ? "..." : field;

    // determining css style to use based on task's status/priority
    const statusStyling = {"Completed": "status-completed", "Pending": "status-pending", "On Hold": "status-on-hold"};
    const priorityStyling = {"High": "priority-high", "Medium": "priority-medium", "Low": "priority-low"}

    return (
        <div id={"displayedTasks"}>
            <h3>Your tasks:</h3>

            {(tasks.length === 0) ? ( // no tasks in the database
                <p>You have no tasks!</p>
            ) : (listOfTasks.length === 0) ? ( // no tasks adhering to the current: searching and filtering criteria
                <p>You have no tasks that meet the current filter!</p>
            ) : (
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