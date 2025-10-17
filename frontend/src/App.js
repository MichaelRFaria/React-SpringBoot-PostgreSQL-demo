import logo from './logo.svg';
import './App.css';
import {useState} from "react";

// to run type the following into the cmd in the frontend directory:
// npm start
// ctrl+c to stop

// export default specifies that this is the main component in the file.
export default function App() {
    // states are used to define information that you plan to change
    // functions starting with "use" are called "Hooks",
    // each hook lets you use a different React feature from your component.
    const [reqContents, setReqContents] = useState([]);

    return (
        <div className="App">
            {/*<header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>*/}

            {/* <form> element allows you to create interactive controls for submitting information.
            "onSubmit" is a unique special prop/event handler for form elements (similar to how <button> has onClick)
            note 1: both onSubmit, onClick and similar, utilise function references as opposed to function calls
            note 2: the input boxes must contain "name" attributes with values equal to their associated field name*/}
            <form onSubmit={postData}>
                <p>Input a new task below:</p>
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

            <hr/>

            <p>Retrieved data:</p>
            {/* a comment within JSX (anything that is rendered)
      must be wrapped in curled braces and use a multi-line comment */}
            {/* creating a component */}
            <DisplayTasks/>
            <p>Button that fetches from database</p>
            <button onClick={getData}>Click to get data!</button>
        </div>
    );

    // we are able to pass in the event, and React will pass it in at runtime when the submit event triggers
    async function postData(e) {
        // prevents the browser from reloading the page
        e.preventDefault();

        // retrieves a reference of the element, which triggered the event
        const form = e.target;
        // "When specified with a <form> element, the FormData object will be populated with the form's current keys/values,
        // using the name property of each element for the keys and their submitted value for the values."
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        // todo create other js files for organisation

        // var for url for simplicity
        const url = "http://localhost:8080/task"

        try {
            // using fetch with just a URL as its parameter makes a GET request, you can add additional params for method, headers, etc
            const response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"} ,
                body: JSON.stringify(data)});
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            await getData();
        } catch (error) {
            console.error(error.message);
        }
    }

    // A good rule of thumb for defining components is:
    // Define it locally, if it is only used within the component it's defined in.
    // Define it globally, if it is going to be reused or shared by several components, and just pass in props.

    // simple method to make a GET request
    async function getData() {
        const url = "http://localhost:8080/task";

        try {
            // using fetch with just a URL as its parameter makes a GET request, you can add additional params for method, headers, etc
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            setReqContents(result)
            console.log(result);
        } catch (error) {
            console.error(error.message);
        }
    }

    // React components have the same syntax as JavaScript functions

    // simple method to display the tasks retrieved from the backend
    // todo could probably render this automatically without having to click
    function DisplayTasks() {
        // React has no clue how to display an object, so we need to map the object, to something that React can recognise
        // in this case it's the data members of the Task object, which consist of: Integer, String, and LocalDate, which React understands
        const listOfTasks = reqContents.map(task =>
            // you must specify a key for React's DOM to be able to figure out which elements have been updated, so it can rerender the list properly
            <li key={task.id}>{task.id} | {task.title} | {task.description} | {task.status} | {task.dueDate}</li>
        )

        return <ul>{listOfTasks}</ul>
    }

}
