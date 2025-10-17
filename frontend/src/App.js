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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
      </header>

        <p>Input a new task below:</p>
        {/* typically you put input boxes with label tags. this tells the browser that the label
         is associated with the input box leading to some effects like:
         screen readers announcing the label caption when selecting an input,
         selecting the label will focus on the input,
         highlighting the label will highlight the input, etc*/}
        <label>
            Title:
            <input id={"title"} />
        </label>
        <label>
            Description:
            <input id={"description"} />
        </label>
        <label>
            Status:
            <input id={"status"} />
        </label>
        <label>
            Due date:
            <input id={"dueDate"} />
        </label>

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
