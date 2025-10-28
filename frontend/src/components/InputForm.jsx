// simple component that displays an input form that allows the user to execute different operations on the database

import {sendData, deleteData} from '../utils/api';
import {useEffect, useState} from "react";
import Notification from "./Notification";
import "../styles/InputForm.css"

// React components have the same syntax as JavaScript functions
// Note: React components must start with a capital letter

//todo
// updating a task makes the list unordered by pushing the updated task to the bottom (Tasks component needs fix for this. could implement filter options there e.g: date added (order of id), due date, status (aggregate))

export default function InputForm({tasks, updateTasks}) {
    const [selectedId, setSelectedId] = useState("new");
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

        // FormData() turns form into key/value pairs  -> .entries() turns pairs into list  ->  Object.fromEntries() turns list into JS object
        const data = Object.fromEntries(new FormData(e.target).entries());
        //console.log(data)

        await submitData(data)

        displayNotification(3000);
        updateTasks();
    }

    // handles actually submitting the create/update request to the backend, also handles error checking based on several factors
    const submitData = async (data) => {
        // we check that all the input boxes are filled
        for (const key in data) {
            if (data[key] === null || data[key].length === 0) {
                setNotificationMessage("Please fill in the input boxes");
                return;
            }
        }

        // if we are trying to update a task and there are no tasks in the database, then we print an error
        if (tasks.length === 0 && selectedId !== "new") {
            setNotificationMessage("There are no tasks to update!");
            return;
        }

        // otherwise we create/update the task in the database

        // interestingly you can call async functions without awaiting them, but this can lead to some strange issues, like having to press submit twice before a new task is created
        const status = await sendData(data, selectedId);

        // if we receive a success status code, we print a success message, otherwise we print an error message
        if (status >= 200 && status <= 299) {
            const operation = (selectedId === "new" ? "created" : "updated")
            setNotificationMessage(`Task successfully ${operation}`);
        } else {
            setNotificationMessage("Error encountered, please try again")
        }
    }

    // handles deleting tasks
    const handleDelete = async () => {
        if (tasks.length > 0) {
            const status = await deleteData(selectedId);
            if (status >= 200 && status <= 299) {
                setNotificationMessage("Task successfully deleted");
            } else {
                setNotificationMessage("Error encountered, please try again")
            }
        } else {
            setNotificationMessage("There are no tasks to delete!")
        }

        displayNotification(3000);
        updateTasks();
    }

    // todo else {} some sort of error (specifically kicks when deleting last id due to tasks dependency)
    useEffect(() => {
        if (selectedMethod === "create") {
            setSelectedId("new");
        } else if (selectedMethod === "update" || selectedMethod === "delete") {
            if (tasks.length > 0) {
                setSelectedId(tasks[0].id);
            }
        }
    }, [selectedMethod, tasks]);

    // populating our dropdown of ids with id's from the tasks
    const dropDownOptions = tasks.map(task =>
        <option value={task.id}>{task.id}</option>
    )

    return (
        <div id={"taskInputs"}>
            <label>
                Method:
                <select id={"methodDropdown"} value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}>
                    <option value="create">Add</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                </select>
            </label>

            {/* JSX shorthand for "render this only if condition is true, otherwise ... "*/}
            {(selectedMethod === "update" || selectedMethod === "delete") && (
                <label>
                    ID:
                    <select id={"idDropdown"} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
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
                        <input name="status"/>
                    </label>
                    <label>
                        Due date:
                        <input name="dueDate"/>
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