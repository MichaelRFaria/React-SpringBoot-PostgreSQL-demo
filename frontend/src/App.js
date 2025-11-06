import './styles/App.css';
import Tasks from "./components/Tasks";
import InputForm from "./components/InputForm"
import {useState, useEffect} from "react";
import {getData} from "./utils/api";

export default function App() {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        const result = await getData();
        // todo add error case either in method or here
        setTasks(result);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="App">
            <div>
                <InputForm tasks={tasks} updateTasks={fetchTasks}/>
            </div>

            <hr/>

            <div>
                <Tasks tasks={tasks}/>
            </div>
        </div>
    );
}
