import './styles/App.css';
import Tasks from "./components/Tasks";
import InputForm from "./components/InputForm"
import FilterOptions from "./components/FilterOptions";
import {useState, useEffect} from "react";
import {getData} from "./utils/api";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [sortValue, setSortValue] = useState("id");
    const [searchValue, setSearchValue] = useState("");
    const [filterConstraints, setFilterConstraints] = useState({
        completed: true,
        uncompleted: true,
        notStarted: true,
        started: true,
        beforeDueDate: true,
        overdue: true
    });

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

                <hr/>

                <FilterOptions sortValue={sortValue} setSortValue={setSortValue}
                               setSearchValue={setSearchValue} filterConstraints={filterConstraints}
                               setFilterConstraints={setFilterConstraints}/>
            </div>

            <hr/>

            <div>
                <Tasks tasks={tasks} sortValue={sortValue} searchValue={searchValue}
                       filterConstraints={filterConstraints}/>
            </div>
        </div>
    );
}
