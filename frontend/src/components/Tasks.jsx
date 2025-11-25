import '../styles/Tasks.css'
import {useEffect, useState} from "react";
import {comparePriority, convertDate, daysRemaining} from "../utils/utilFuncs";

// simple component that displays an HTML list of tasks from a given tasks prop
export default function Tasks({tasks}) {
    const [listOfTasks, setListOfTasks] = useState([]);
    const [sortValue, setSortValue] = useState("id");
    const [searchValue, setSearchValue] = useState("");
    const [filterConstraints, setFilterConstraints] = useState({
        completed: true,
        uncompleted: true,
        notStarted: true,
        started: true,
        beforeDueDate: true,
        overdue: true
    });
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
            <h3>Filter and sort your results:</h3>
            <div id={"taskOptions"}>
                <div id={"searchOptions"}>
                    <label>
                        <h4>Search for Task:</h4>
                        Search for:
                        <input name="searchValue" onChange={e => setSearchValue(e.target.value)}/>
                    </label>
                </div>
                <div id={"sortOptions"}>
                    <label>
                        <h4>Sort Tasks:</h4>
                        <select value={sortValue} onChange={e => setSortValue(e.target.value)}>
                            <option value="id">ID</option>
                            <option value="title">Title</option>
                            <option value="status">Status</option>
                            <option value="priority">Priority</option>
                            <option value="startDate">Start Date</option>
                            <option value="dueDate">Date Due</option>
                        </select>
                    </label>
                </div>

                <div id={"filterOptions"}>
                    <h4>Filter Tasks:</h4>
                    <label>
                        Completed:
                        <input type="checkbox" name="completed" checked={filterConstraints.completed}
                               defaultChecked={true}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        Uncompleted:
                        <input type="checkbox" name="uncompleted" checked={filterConstraints.uncompleted}
                               defaultChecked={true}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        Before due date:
                        <input type="checkbox" name="beforeDueDate" checked={filterConstraints.beforeDueDate}
                               defaultChecked={true} onChange={e => setFilterConstraints(prevState => ({
                            ...prevState,
                            [e.target.name]: e.target.checked
                        }))}/>
                    </label>
                    <label>
                        Overdue:
                        <input type="checkbox" name="overdue" checked={filterConstraints.overdue}
                               defaultChecked={true}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        Started:
                        <input type="checkbox" name="started" checked={filterConstraints.started}
                               defaultChecked={true} onChange={e => setFilterConstraints(prevState => ({
                            ...prevState,
                            [e.target.name]: e.target.checked
                        }))}/>
                    </label>
                    <label>
                        Not Started:
                        <input type="checkbox" name="notStarted" checked={filterConstraints.notStarted}
                               defaultChecked={true}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                </div>
            </div>

            <hr></hr>

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
                                <td>{daysRemaining(task.dueDate)}</td>
                            </tr>)}
                    </table>
                </div>
            ) : (
                <p>You have no tasks!</p>
            )}
        </div>
    )
}