import './styles/App.css';
import Tasks from "./components/Tasks";
import InputForm from "./components/InputForm"
import {useState, useEffect} from "react";
import {getData} from "./utils/api";

// to run type the following into the cmd in the frontend directory:
// npm start
// ctrl+c to stop

// todo add window alerts to errors
//  update comments
//  create other js files for organisation
//  unspagettify the code - putting the components and api functions into separate files led to so much extra clutter, but some things can definitely be removed, go through the entire program flow and delete now obselete code

// export default specifies that this is the main component in the file.
export default function App() {
    // states are used to define information that you plan to change
    // functions starting with "use" are called "Hooks",
    // each hook lets you use a different React feature from your component.
    const [tasks, setTasks] = useState([]);
    // todo i think these two states below can be moved into their appropriate methods
    const [selectedId, setSelectedId] = useState("new");
    // can use to make a single HTTP request function later
    const [selectedMethod, setSelectedMethod] = useState("post/put");

    // we create an async "arrow function expression" and call it, we need the asynchronous aspect as we must "await" the data
    // note: this is essentially JS' equivalent of a lambda. a function without a name stored in a variable that can be passed around
    const fetchTasks = async () => {
        const result = await getData();
        setTasks(result);
    };

    // useEffect is a hook that allows you to perform side effects in your components, examples include:
    // fetching data, directly updating the DOM, and timers
    useEffect( () => {
        fetchTasks();
    }, []);
    // ^ no dependency would run this effect every re-render,
    // an empty array means it runs only on the first render,
    // if you put a prop or state in the array, anytime that is updated it would re-render

    return (
        <div className="App">
            {/*<p>Input a new task below:</p>*/}
            <div id={"taskInputs"}>
                <InputForm tasks={tasks} id={selectedId} setId={setSelectedId} method={selectedMethod} setMethod={setSelectedMethod} updateTasks={fetchTasks}/>
            </div>

            <hr/>

            <p>Retrieved data:</p>
            {/* a comment within JSX (anything that is rendered)
      must be wrapped in curled braces and use a multi-line comment */}
            {/* creating a component */}
            <Tasks tasks={tasks}/>
        </div>
    );
}
