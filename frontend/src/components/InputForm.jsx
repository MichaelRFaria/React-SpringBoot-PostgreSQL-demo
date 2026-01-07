import {sendData, deleteData, deleteAllData} from '../utils/api';
import {useEffect, useMemo, useState} from "react";
import {convertDate} from "../utils/utilFuncs";
import {displayHTTPStatusMessage, replaceEmptyFields} from "../utils/InputFormFuncs";
import Notification from "./Notification";
import Alert from "./Alert";
import "../styles/InputForm.css"

// simple component that displays an input form that allows the user to execute different operations on the database
export default function InputForm({tasks, updateTasks}) {
    const [selectedId, setSelectedId] = useState(-1);
    const [selectedMethod, setSelectedMethod] = useState("create");

    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationVisibility, setNotificationVisibility] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertVisibility, setAlertVisibility] = useState(false);
    const [alertAction1, setAlertAction1] = useState();
    const [alertAction2, setAlertAction2] = useState();


    // we set the min value of the start date to the current date
    const [localDate] = useState(() => convertDate(new Date().toLocaleDateString().replaceAll("/", "-")));
    // we set the min value of the due date to the start date selected
    const [startDate, setStartDate] = useState(() => localDate);

    // displays a notification for a set amount of time
    const displayNotification = (time) => {
        setNotificationVisibility(true);
        setTimeout(() => {
            setNotificationVisibility(false);
        }, time);
    }

    // displays an alert with the given message and selectable actions
    const displayAlert = (message, action1, action2) => {
        setAlertMessage(message);
        setAlertAction1(() => action1);
        setAlertAction2(() => action2);
        setAlertVisibility(true);
    }

    // handles submitting a form (either creating or updating a task, deleting has its own function)
    const handleSubmit = async (e) => {
        // stops browser from refreshing on form submit
        e.preventDefault();

        // FormData() turns the form's inputs into key/value pairs
        let formData = new FormData(e.target);

        await submitData(formData);

        displayNotification(3000);
        updateTasks();
    }

    // handles actually submitting the create/update request to the backend, also handles error checking based on several factors
    const submitData = async (formData) => {
        // converting key/value pairs into JS object
        let data = Object.fromEntries(formData.entries());

        // if creating a new task, we check that all the input boxes are filled in
        if (selectedMethod === "create") {
            for (const key in data) {
                if (data[key] === null || data[key].length === 0) {
                    setNotificationMessage("Please fill in all of the input boxes");
                    return;
                }
            }
        }

        // if we are trying to update a task and there are no tasks in the database, then we print an error
        if (tasks.length === 0 && selectedMethod === "update") {
            setNotificationMessage("There are no tasks to update!");
            return;
        }

        // if we are trying to update a task, we replace any empty inputs with the value from the database
        if (selectedMethod === "update") {
            const task = tasks.find(t => parseInt(t.id) === selectedId);
            data = replaceEmptyFields(formData, task);
        }

        // we convert the date from the form into the LocalDate type format for the database, if it is not in the correct format
        // conditional as:
        // it may be in the correct format if we are updating, and we substitute an empty date input (which would be dd-mm-yyyy) with the copy already in the database (which is yyyy-mm-dd)
        if (data.dueDate.charAt(2) === '-') {
            data.dueDate = convertDate(data.dueDate);
        }
        if (data.startDate.charAt(2) === '-') {
            data.startDate = convertDate(data.startDate);
        }

        // finally we create/update the task in the database
        const status = await sendData(data, selectedId);

        setNotificationMessage(displayHTTPStatusMessage(status, selectedMethod));
    }

    // handles deleting tasks
    const handleDelete = async () => {
        // delete task if tasks exist, otherwise display error message
        if (tasks.length > 0) {
            const status = await deleteData(selectedId);
            setNotificationMessage(displayHTTPStatusMessage(status, selectedMethod));
        } else {
            setNotificationMessage("There are no tasks to delete!");
        }

        displayNotification(3000);
        updateTasks();
    }

    // handles deleting all completed or overdue tasks
    const handleDeletingWithCriteria = async (criteria) => {
        // if no tasks exist then we display an error message, otherwise we delete all tasks matching the criteria parameter
        if (tasks.length <= 0) {
            setNotificationMessage("There are no tasks to delete!");
        } else {
            let i = 0;
            let success = true;
            let status = -1;

            // loops while we have remaining tasks to look at and, while the task was successfully deleted (assuming that we did delete a task)
            do {
                if ((criteria === "overdue" && tasks[i].dueDate <= localDate) || (criteria === "completed" && tasks[i].status === "Completed")) {
                    status = await deleteData(tasks[i].id);

                    success = (status >= 200 && status < 300);
                }
                i++;
            } while (i < tasks.length && success);

            // setting the appropriate notification message
            if (status === -1) {
                setNotificationMessage(`No ${criteria} tasks deleted.`); // status initialised as -1, if it remains -1, then we have not deleted any tasks.
            } else {
                setNotificationMessage(displayHTTPStatusMessage(status, selectedMethod, true)); // status has been updated in the loop, either success or some sort of error.
            }
        }

        displayNotification(3000);
        setAlertVisibility(false);
        updateTasks();
    }

    // handles deleting all tasks
    const deleteAll = async () => {
        // if no tasks exist then we display an error message, otherwise we delete all tasks matching the criteria parameter
        if (tasks.length <= 0) {
            setNotificationMessage("There are no tasks to delete!");
        } else {
            const status = await deleteAllData();
            setNotificationMessage(displayHTTPStatusMessage(status, selectedMethod, true));
        }

        displayNotification(3000);
        setAlertVisibility(false);
        updateTasks();
    }

    // an array of ordered ids, used for populating the ID dropdown menus and for resetting those dropdown menus when switching methods or deleting a task
    const orderedIds = useMemo(() => {
        return [...tasks].map(task => parseInt(task.id)).sort((a, b) => a - b)
    }, [tasks]);

    // handling setting the ID when selecting the delete method AND when the last task is deleted
    useEffect(() => {
        if (selectedMethod === "delete") {
            if (tasks.length > 0) {
                // change ID to the first ID in the dropdown menu
                setSelectedId(orderedIds[0]);
            } else {
                // special case: when the selected method is "delete" and the tasks become empty (we have just deleted the last task),
                // we must forcefully switch the method to create as we can't update/delete on an empty database (reason for tasks hook dependency)
                setSelectedMethod("create");
                setSelectedId(-1);
            }
        }
    }, [selectedMethod, tasks, orderedIds]);

    // handling setting the ID when selecting the create or update methods
    useEffect(() => {
        // creating and updating requests are differentiated by their IDs. (PUT requests require an actual ID / <1, POST requests are indicated by an ID of -1)
        if (selectedMethod === "create") {
            setSelectedId(-1);
        } else if (selectedMethod === "update") {
            // change ID to the first ID in the dropdown menu
            setSelectedId(orderedIds[0]);
        }
    }, [selectedMethod, orderedIds])

    return (
        <div id="taskInputs">
            <h3>Change your tasks:</h3>
            <label>
                Method:
                <select id="methodDropdown" value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}>
                    <option value="create">Add</option>
                    <option value="update" disabled={tasks.length === 0}>Update</option>
                    <option value="delete" disabled={tasks.length === 0}>Delete</option>
                </select>
            </label>

            {(selectedMethod === "update" || selectedMethod === "delete") && (
                <label>
                    ID:
                    <select id="idDropdown" value={selectedId}
                            onChange={e => setSelectedId(parseInt(e.target.value))}>
                        {orderedIds.map(task =>
                            <option value={parseInt(task.id)}>{task.id}</option>
                        )}
                    </select>
                </label>
            )}

            {(selectedMethod === "create" || selectedMethod === "update") && (
                /* form's onSubmit creates a formEvent*/
                <form onSubmit={handleSubmit}>
                    <div id="inputFormContainer">
                        <div id="inputFormContainerLeft">
                            <label>
                                <p>Title:</p>
                                <input name="title" placeholder="Provide a title for the task."/>
                            </label>
                            <label>
                                <p>Description:</p>
                                <textarea name="description" placeholder="Provide a description for the task."/>
                            </label>
                        </div>
                        <div id="inputFormContainerRight">
                            <div id="statusAndPriority">
                                <label>
                                    <p>Status:</p>
                                    <select id="statusDropdown" name="status">
                                        {selectedMethod === "update" && (
                                            <option selected={true} value="Copy">Copy</option>
                                        )}
                                        <option value="Pending">Pending</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </label>
                                <label>
                                    <p>Priority:</p>
                                    <select id="priorityDropdown" name="priority">
                                        {selectedMethod === "update" && (
                                            <option selected={true} value="Copy">Copy</option>
                                        )}
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </label>
                            </div>
                            <div id="inputFormDates">
                                <label>
                                    <p>Start date:</p>
                                    <input name="startDate" type="date" min={localDate}
                                           onChange={e => setStartDate(e.target.value)}/>
                                </label>
                                <label>
                                    <p>Due date:</p>
                                    <input name="dueDate" min={startDate} type="date"/>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* utilising button's unique "reset" and "submit" types */}
                    <button type="reset">Reset</button>
                    <button type="submit">Submit</button>
                </form>
            )
            }

            {
                selectedMethod === "delete" && (
                    <>
                        <button onClick={handleDelete}>Delete</button>

                        <hr/>

                        <button
                            onClick={() => displayAlert("Are you sure you want to delete all tasks?", () => deleteAll(), () => setAlertVisibility(false))}>Delete
                            All
                        </button>
                        <button
                            onClick={() => displayAlert("Are you sure you want to delete all overdue tasks?", () => handleDeletingWithCriteria("overdue"), () => setAlertVisibility(false))}>Delete
                            Overdue
                        </button>
                        <button
                            onClick={() => displayAlert("Are you sure you want to delete all completed tasks?", () => handleDeletingWithCriteria("completed"), () => setAlertVisibility(false))}>Delete
                            Completed
                        </button>
                    </>
                )
            }
            <div>
                <Notification message={notificationMessage} isVisible={notificationVisibility}/>
            </div>

            <div>
                <Alert message={alertMessage} isVisible={alertVisibility} action1={alertAction1}
                       action2={alertAction2}/>
            </div>
        </div>
    )
}