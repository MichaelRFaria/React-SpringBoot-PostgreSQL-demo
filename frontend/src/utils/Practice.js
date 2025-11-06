import logo from '../assets/logo.svg';
import '../styles/Practice.css';
import {useState} from "react";

// to run type the following into the cmd in the frontend directory:
// npm start
// ctrl+c to stop

// React components have the same syntax as JavaScript functions
function MyButton() {
    // states are used to define information that you plan to change
    // functions starting with "use" are called "Hooks", each hook lets you use a different React feature from your component.
    // in this case each button has its own count variable
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    return <button onClick={handleClick}>
        You've clicked me {count} times!
    </button>
}

// we must create parameters in the component to read the "props"
// passed from the parent component
function MyButtonAlt({count, onClick}) {
    return <button onClick={onClick}>
        You've clicked me {count} times!
    </button>
}


// export default specifies that this is the main component in the file.
export default function App() {
    // you may want a component to share data and always update together
    // to do this we move the state from the individual components to the closest component that contains them all
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    return (
        <div className="App">
            <header className="App-header">
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
            </header>

            {/* a comment within JSX (anything that is rendered)
      must be wrapped in curled braces and use a multi-line comment */}
            {/* creating a component */}
            <MyButton/>

            {/* creating components that share a state */}
            <p>Buttons that update together</p>
            {/* passing information like this is called "props"
      the MyApp component contains the "count" state and the "handleClick"
      event handler and pass them down as "props" to each of the buttons */}
            <MyButtonAlt count={count} onClick={handleClick}/>
            <MyButtonAlt count={count} onClick={handleClick}/>
        </div>
    );
}

// Newer App.js


// import './styles/App.css';
// import Tasks from "./components/Tasks";
// import InputForm from "./components/InputForm"
// import {useState, useEffect} from "react";
// // we can import functions from other js files
// import {getData} from "./utils/api";
//
// // to start the frontend, type the following into the cmd in the frontend directory:
// // npm start
// // then:
// // ctrl+c to stop
//
// // export default specifies that this is the main component in the app.
// export default function App() {
//     // states are used to define information that you plan to change
//     // functions starting with "use" are called "Hooks",
//     // each hook lets you use a different React feature within your component.
//     const [tasks, setTasks] = useState([]);
//
//     // we create an async "arrow function expression" and call it, we need the asynchronous aspect as we must "await" the data to be returned form getData
//     // note: this is essentially JS' equivalent of a lambda. a function without a name stored in a variable that can be passed around
//     const fetchTasks = async () => {
//         const result = await getData();
//         setTasks(result);
//     };
//
//     // useEffect is a hook that allows you to perform side effects in your components, examples include:
//     // fetching data, directly updating the DOM, and timers
//     useEffect(() => {
//         fetchTasks();
//     }, []);
//     // ^ no dependency would run this effect every re-render,
//     // an empty array means it runs only on the first render,
//     // if you put a prop or state in the array, anytime that is updated it would re-render
//
//     return (
//         <div className="App">
//             {/* a comment within JSX (anything that is rendered)
//       must be wrapped in curled braces and use a multi-line comment */}
//             <div>
//                 {/* creating a component */}
//                 {/* passing information from a parent component into a child component is called passing "props" */}
//                 {/* we pass a reference to the fetchTasks into the InputForm component, so we can update the data in the tasks state,
//                  after we submit an input form */}
//                 <InputForm tasks={tasks} updateTasks={fetchTasks}/>
//             </div>
//
//             <hr/>
//
//             <div>
//                 <Tasks tasks={tasks}/>
//             </div>
//         </div>
//     );
// }

