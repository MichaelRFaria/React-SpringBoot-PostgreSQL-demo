import {sendData, deleteData, deleteAllData} from '../utils/api';
import {useEffect, useState} from "react";
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

    const [alertMessage, setAlertMessage] = useState("test");
    const [alertVisibility, setAlertVisibility] = useState(false);
    const [alertAction1, setAlertAction1] = useState();
    const [alertAction2, setAlertAction2] = useState();


    // we set the min value of the start date to the current date
    const [localDate, setLocalDate] = useState("");
    // we set the min value of the due date to the start date selected
    const [startDate, setStartDate] = useState("");

    useEffect(() => {
        setLocalDate(convertDate(new Date().toLocaleDateString().replaceAll("/", "-")));
        setStartDate(localDate);
    }, [])

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

        await submitData(formData)

        displayNotification(3000);
        updateTasks();
    }

    // handles actually submitting the create/update request to the backend, also handles error checking based on several factors
    const submitData = async (formData) => {
        // converting key/value pairs into JS object
        let data = Object.fromEntries(formData.entries())

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
            setNotificationMessage("There are no tasks to delete!")
        }

        displayNotification(3000);
        updateTasks();
    }

    // handles deleting all completed or overdue tasks
    const handleDeletingWithCriteria = async (criteria) => {
        // if no tasks exist then we display an error message, otherwise we delete all tasks matching the criteria parameter
        if (tasks.length <= 0) {
            setNotificationMessage("There are no tasks to delete!")
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
            setNotificationMessage("There are no tasks to delete!")
        } else {
            const status = await deleteAllData();
            setNotificationMessage(displayHTTPStatusMessage(status, selectedMethod, true));
        }

        displayNotification(3000);
        setAlertVisibility(false);
        updateTasks();
    }

    // when we change the method, we must reset the selectedId state to an appropriate value
    useEffect(() => {
        // creating and updating requests are differentiated by their IDs. (PUT requests require an actual ID / <1, POST requests are indicated by an ID of -1)
        if (selectedMethod === "create") {
            setSelectedId(-1);
            // whenever we delete a task, we must reset the selectedID, otherwise the value in the ID dropdown menu, won't correspond with the ID in the state (hence we have "tasks" as a dependency)
        } else if (selectedMethod === "delete") {
            if (tasks.length > 0) {
                setSelectedId(parseInt(tasks[0].id));
            } else {
                // special case: when the selected method is "delete" and the tasks become empty (we have just deleted the last task),
                // we must forcefully switch the method to create as we can't update/delete on an empty database
                setSelectedMethod("create");
                setSelectedId(-1);
            }
        }
    }, [selectedMethod, tasks]);

    // when we change the method, we must reset the selectedId state to an appropriate value
    // this version is only for the update method, this is because
    // the above useEffect has a "tasks" dependency, meaning everytime you update a task, it would trigger the code below,
    // which resets the selected id in the dropdown menu to the first id. this is inconvenient as a user may wish to the same task repeatedly for correction, etc
    // overall this is cleaner, removing unnecessary dropdown menu updating
    useEffect(() => {
        if (selectedMethod === "update") {
            setSelectedId(parseInt(tasks[0].id))
        }
    }, [selectedMethod])

    // populating our dropdown of ids with id's from the tasks
    const dropDownOptions = tasks.sort((a, b) => parseInt(a.id) - parseInt(b.id)) // we sort the IDs as when updating tasks, we actually append the task to the end of the database,
        // which will cause this dropdown to not appear in order
        .map(task =>
            <option value={parseInt(task.id)}>{task.id}</option>
        )

    return (
        <div id={"taskInputs"}>
            <h3>Change your tasks:</h3>
            <label>
                Method:
                <select id={"methodDropdown"} value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}>
                    <option value="create">Add</option>
                    <option value="update" disabled={tasks.length === 0}>Update</option>
                    <option value="delete" disabled={tasks.length === 0}>Delete</option>
                </select>
            </label>

            {(selectedMethod === "update" || selectedMethod === "delete") && (
                <label>
                    ID:
                    <select id={"idDropdown"} value={selectedId}
                            onChange={e => setSelectedId(parseInt(e.target.value))}>
                        {dropDownOptions}
                    </select>
                </label>
            )}

            {(selectedMethod === "create" || selectedMethod === "update") && (
                /* form's onSubmit creates a formEvent*/
                <form onSubmit={handleSubmit}>
                    <div id="inputFormContainer">
                        <div id="inputFormContainerLeft">
                            <label>
                                Title:
                                <input name="title" placeholder="Provide a title for the task."/>
                            </label>
                            <label>
                                Description:
                                <textarea name="description" placeholder="Provide a description for the task."/>
                            </label>
                        </div>
                        <div id="inputFormContainerRight">
                            <div id="statusAndPriority">
                                <label>
                                    Status:
                                    <select id={"statusDropdown"} name="status">
                                        {selectedMethod === "update" && (
                                            <option selected={true} value={"Copy"}>Copy</option>
                                        )}
                                        <option value={"Pending"}>Pending</option>
                                        <option value={"On Hold"}>On Hold</option>
                                        <option value={"Completed"}>Completed</option>
                                    </select>
                                </label>
                                <label>
                                    Priority:
                                    <select id={"priorityDropdown"} name="priority">
                                        {selectedMethod === "update" && (
                                            <option selected={true} value={"Copy"}>Copy</option>
                                        )}
                                        <option value={"High"}>High</option>
                                        <option value={"Medium"}>Medium</option>
                                        <option value={"Low"}>Low</option>
                                    </select>
                                </label>
                            </div>
                            <div id="inputFormDates">
                                <label>
                                    Start date:
                                    <input name="startDate" type="date" min={localDate}
                                           onChange={e => setStartDate(e.target.value)}/>
                                </label>
                                <label>
                                    Due date:
                                    <input name="dueDate" min={startDate} type="date"/>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* utilising button's unique "reset" and "submit" types */
                    }
                    <button type={"reset"}>Reset</button>
                    <button type={"submit"}>Submit</button>
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