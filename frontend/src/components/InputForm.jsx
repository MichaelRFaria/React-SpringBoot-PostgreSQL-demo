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

    const toggleNotification = () => {
        setNotificationVisibility(!notificationVisibility);
        console.log(notificationVisibility)
    }

    // this arrow function expression serves more than just as an easy way to create a short function,
    // but it also allows us to work with the event (e) that the form element's onSubmit button produces, which we can't define at compile-time (I think???)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        if (tasks.length > 0 || selectedId === "new") {
            // interestingly you can call async functions without awaiting them, but this can lead to some strange issues, like having to press submit twice before a new task is created
            const status = await sendData(form, selectedId);

            if (status >= 200 && status <= 299) {
                const operation = (selectedId === "new" ? "created" : "updated")
                setNotificationMessage(`Task successfully ${operation}`);
            } else {
                setNotificationMessage("Error encountered, please try again")
            }
        } else {
            setNotificationMessage("There are no tasks to update!")
        }

        setNotificationVisibility(true);
        setTimeout(() => {
            setNotificationVisibility(false);
        }, 3000);
        updateTasks();
    }

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

        setNotificationVisibility(true);
        setTimeout(() => {
            setNotificationVisibility(false);
        }, 3000);
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
            <button onClick={toggleNotification}>
                Test Notification
            </button>
        </div>
    )
}