// simple component that displays an input form that allows the user to execute different operations on the database

import {sendData, deleteData} from '../utils/api';
import {use, useState} from "react";
import Notification from "./Notification";

// React components have the same syntax as JavaScript functions
// Note: React components must start with a capital letter

export default function InputForm({tasks, updateTasks}) {
    const [selectedId, setSelectedId] = useState("new");
    const [selectedMethod, setSelectedMethod] = useState("post/put");

    const [notificationMessage, setNotificationMessage] = useState("test");
    const [notificationVisiblity, setNotificationVisibility] = useState(true);

    const toggleNotification = () => {
        setNotificationVisibility(!notificationVisiblity);
        console.log(notificationVisiblity)
    }

    // this arrow function expression serves more than just as an easy way to create a short function,
    // but it also allows us to work with the event (e) that the form element's onSubmit button produces, which we can't define at compile-time (I think???)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        // interestingly you can call async functions without awaiting them, but this can lead to some strange issues, like having to press submit twice before a new task is created
        await sendData(form, selectedId);
        updateTasks();
    }

    const handleDelete = async () => {
        await deleteData(selectedId);
        updateTasks();
    }

    // populating our dropdown of ids with id's from the tasks
    const dropDownOptions = tasks.map(task =>
        <option value={task.id}>{task.id}</option>
    )

    return (
        <div>
            <label>
                ID:
                <select id={"idDropdown"} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                    <option value="new">New</option>
                    {dropDownOptions}
                </select>
            </label>
            <label>
                Method:
                <select id={"methodDropdown"} value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}>
                    <option value="post/put">Add/Update</option>
                    <option value="delete">Delete</option>
                </select>
            </label>

            {/* JSX shorthand for "render this only if condition is true" */}
            {selectedMethod !== "delete" ? (
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
            ) : (
                <button onClick={handleDelete}>Delete</button>
            )}
            <div>
                <Notification message={notificationMessage} isVisible={notificationVisiblity}/>
            </div>
            <button onClick={toggleNotification}>
                Test Notification
            </button>
        </div>
    )
}