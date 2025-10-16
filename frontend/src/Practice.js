import logo from './logo.svg';
import './Practice.css';
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

            {/* a comment within JSX (anything that is rendered)
      must be wrapped in curled braces and use a multi-line comment */}
            {/* creating a component */}
            <MyButton/>

            {/* creating components that share a state */}
            <p>Buttons that update together</p>
            {/* passing information like this is called "props"
      the MyApp component contains the "count" state and the "handleClick"
      event handler and pass them down as "props" to each of the buttons */}
            <MyButtonAlt count={count} onClick={handleClick} />
            <MyButtonAlt count={count} onClick={handleClick} />
        </div>
    );
}
