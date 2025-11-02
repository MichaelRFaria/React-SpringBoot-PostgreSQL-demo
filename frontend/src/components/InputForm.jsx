// simple component that displays an input form that allows the user to execute different operations on the database

import {sendData, deleteData} from '../utils/api';
import {useEffect, useState} from "react";
import Notification from "./Notification";
import "../styles/InputForm.css"

// React components have the same syntax as JavaScript functions
// Note: React components must start with a capital letter

export default function InputForm({tasks, updateTasks}) {
    const [selectedId, setSelectedId] = useState(-1);
    const [selectedMethod, setSelectedMethod] = useState("create");

    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationVisibility, setNotificationVisibility] = useState(false);

    // displays notification for a set amount of time
    const displayNotification = (time) => {
        setNotificationVisibility(true);
        setTimeout(() => {
            setNotificationVisibility(false);
        }, time);
    }

    // handles submitting a form (either creating or updating a task)

    // this arrow function expression serves more than just as an easy way to create a short function,
    // but it also allows us to work with the event (e) that the form element's onSubmit button produces, which we can't define at compile-time (I think???)
    const handleSubmit = async (e) => {
        // stops browser from refreshing on form submit
        e.preventDefault();

        // FormData's Javadoc states: "When specified with a <form> element, the FormData object will be populated with the form's current keys/values,
        // using the name property of each element for the keys and their submitted value for the values."

        // FormData() turns form's inputs into key/value pairs
        let formData = new FormData(e.target);
        //console.log(data)

        await submitData(formData)

        displayNotification(3000);
        updateTasks();
    }

    // simple function to convert a string in the dd-mm-yyyy date format to yyyy-mm-dd (which is the format of LocalDate, which is used for the database)
    const convertDate = (date) => {
        const [d, m, y] = date.split('-');
        return `${y}-${m}-${d}`;
    }

    // handles actually submitting the create/update request to the backend, also handles error checking based on several factors
    const submitData = async (formData) => {
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

        // if we are trying to update a task, we replace any empty inputs with the previous input
        if (selectedMethod === "update") {
            data = replaceEmptyFields(formData);
        }

        // we convert the date from the form into the LocalDate type format for the database
        data.dueDate = convertDate(data.dueDate);

        // otherwise we create/update the task in the database

        // interestingly you can call async functions without awaiting them, but this can lead to some strange issues, like having to press submit twice before a new task is created
        const status = await sendData(data, selectedId);

        displayHTTPStatusMessage(status);
    }

    // function to replace empty input boxes with values from the existing task, when updating
    const replaceEmptyFields = (formData) => {
        let index = -1;

        for (let i = 0; i < tasks.length; i++) {
            if (parseInt(tasks[i].id) === selectedId) {
                index = i;
                break;
            }
        }

        const task = tasks[index];
        // array of values of the existing task's properties
        const values = [task.title, task.description, task.status, task.dueDate]

        // 2d-array of key/value pairs (field name -> value)
        let arr = Array.from(formData);

        for (const key in arr) {
            const value = arr[key][1];
            if (value === null || value.length === 0 || value.trim === "") {
                arr[key][1] = values[key];
            }
        }

        // our API handles JS objects
        return Object.fromEntries(arr);
    }

    // handles deleting tasks
    const handleDelete = async () => {
        if (tasks.length > 0) {
            const status = await deleteData(selectedId);
            displayHTTPStatusMessage(status);
        } else {
            setNotificationMessage("There are no tasks to delete!")
        }

        displayNotification(3000);
        updateTasks();
    }

    // function to display a message corresponding to the status code produced by an HTTP method
    const displayHTTPStatusMessage = (status) => {
        const action = selectedMethod + "d"; // getting the correct verb - "created", "updated", "deleted"

        if (status >= 200 && status <= 299) {
            setNotificationMessage(`Task successfully ${action}`);
        } else if (status >= 400 && status <= 499) {
            setNotificationMessage("Client-side error encountered, please try again");
        } else if (status >= 500 && status <= 599) {
            setNotificationMessage("Server-side error encountered, please try again");
        } else {
            setNotificationMessage("Error encountered, please try again");
        }
    }

    useEffect(() => {
        if (selectedMethod === "create") {
            setSelectedId(-1);
        } else if (selectedMethod === "delete") {
            if (tasks.length > 0) {
                setSelectedId(parseInt(tasks[0].id));
            } else {
                // special case: when the selected method is "delete" and the tasks become empty (we have just deleted the last task),
                // we must switch the method to create as we can't update/delete on an empty database
                setSelectedMethod("create");
                setSelectedId(-1);
            }
        }
    }, [selectedMethod, tasks]);

    // we don't put this in the useEffect above, as the "tasks" dependency, will cause the selected id in the dropdown to reset to the first id,
    // and everytime we update a value, we will change tasks, thus triggering that dependency (but this is slightly inefficient)
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
            <label>
                Method:
                <select id={"methodDropdown"} value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}>
                    <option value="create">Add</option>
                    <option value="update" disabled={tasks.length === 0}>Update</option>
                    <option value="delete" disabled={tasks.length === 0}>Delete</option>
                </select>
            </label>

            {/* JSX shorthand for "render this only if condition is true, otherwise ... "*/}
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
                /* <form> element allows you to create interactive controls for submitting information.
                "onSubmit" is a unique special prop/event handler for form elements (similar to how <button> has onClick)
                note 1: both onSubmit, onClick and similar, utilise function references as opposed to function calls
                note 2: the input boxes must contain "name" attributes with values equal to their associated field name*/
                <form onSubmit={handleSubmit}>
                    {/* typically you put input boxes with label tags. this tells the browser that the label
             is associated with the input box leading to some effects like:
             screen readers announcing the label caption when selecting an input,
             selecting the label will focus on the input,
             highlighting the label will highlight the input, etc*/}
                    <label>
                        Title:
                        <input name="title"/>
                    </label>
                    <label>
                        Description:
                        <input name="description"/>
                    </label>
                    <label>
                        Status:
                        <select id={"statusDropdown"} name="status">
                            <option value={"Pending"}>Pending</option>
                            <option value={"On Hold"}>On Hold</option>
                            <option value={"Completed"}>Completed</option>
                        </select>
                    </label>
                    <label>
                        Due date:
                        <input name="dueDate" placeholder="DD-MM-YYYY"/>
                    </label>
                    {/* the <form> element has unique behaviour where:
                    any <button> of type "reset" will reset inputs within the form to their default values
                    any <button> of type "submit" will trigger the form's onSubmit event */}
                    <button type={"reset"}>Reset</button>
                    <button type={"submit"}>Submit</button>
                </form>
            )}

            {selectedMethod === "delete" && (
                <button onClick={handleDelete}>Delete</button>
            )}
            <div>
                <Notification message={notificationMessage} isVisible={notificationVisibility}/>
            </div>
        </div>
    )
}