import './styles/App.css';
import Tasks from "./components/Tasks";
import InputForm from "./components/InputForm"
import {useState, useEffect} from "react";
// we can import functions from other js files
import {getData} from "./utils/api";

// to start the frontend, type the following into the cmd in the frontend directory:
// npm start
// then:
// ctrl+c to stop

// export default specifies that this is the main component in the app.
export default function App() {
    // states are used to define information that you plan to change
    // functions starting with "use" are called "Hooks",
    // each hook lets you use a different React feature within your component.
    const [tasks, setTasks] = useState([]);

    // we create an async "arrow function expression" and call it, we need the asynchronous aspect as we must "await" the data to be returned form getData
    // note: this is essentially JS' equivalent of a lambda. a function without a name stored in a variable that can be passed around
    const fetchTasks = async () => {
        const result = await getData();
        // todo add error case either in method or here
        setTasks(result);
    };

    // useEffect is a hook that allows you to perform side effects in your components, examples include:
    // fetching data, directly updating the DOM, and timers
    useEffect(() => {
        fetchTasks();
    }, []);
    // ^ no dependency would run this effect every re-render,
    // an empty array means it runs only on the first render,
    // if you put a prop or state in the array, anytime that is updated it would re-render

    return (
        <div className="App">
            {/* a comment within JSX (anything that is rendered)
      must be wrapped in curled braces and use a multi-line comment */}
            <div>
                {/* creating a component */}
                {/* passing information from a parent component into a child component is called passing "props" */}
                {/* we pass a reference to the fetchTasks into the InputForm component, so we can update the data in the tasks state,
                 after we submit an input form */}
                <InputForm tasks={tasks} updateTasks={fetchTasks}/>
            </div>

            <hr/>

            <div id={"displayedTasks"}>
                <h3>Your tasks:</h3>
                {tasks.length !== 0 ? (
                    <Tasks tasks={tasks}/>
                ) : (
                    <p>You have no tasks!</p>
                )}
            </div>
        </div>
    );
}
