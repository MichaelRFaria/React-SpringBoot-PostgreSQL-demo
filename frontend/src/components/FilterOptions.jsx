import '../styles/FilterOptions.css'

export default function FilterOptions({
                                          sortValue,
                                          setSortValue,
                                          setSearchValue,
                                          filterConstraints,
                                          setFilterConstraints
                                      }) {
    return (
        <>
            <h3>Filter and sort your results:</h3>
            <div id={"taskOptions"}>
                <div id={"searching"}>
                    <label>
                        <h4>Search for Task:</h4>
                        Search for:
                        <input name="searchValue" onChange={e => setSearchValue(e.target.value)}/>
                    </label>
                </div>
                <div id={"sorting"}>
                    <label>
                        <h4>Sort Tasks:</h4>
                        <select value={sortValue} onChange={e => setSortValue(e.target.value)}>
                            <option value="id">ID</option>
                            <option value="title">Title</option>
                            <option value="status">Status</option>
                            <option value="priority">Priority</option>
                            <option value="startDate">Start Date</option>
                            <option value="dueDate">Date Due</option>
                        </select>
                    </label>
                </div>

                <div id={"filtering"}>
                    <h4>Filter Tasks:</h4>
                    <label>
                        Completed:
                        <input type="checkbox" name="completed" checked={filterConstraints.completed}
                               defaultChecked={true}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        Uncompleted:
                        <input type="checkbox" name="uncompleted" checked={filterConstraints.uncompleted}
                               defaultChecked={true}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        Before due date:
                        <input type="checkbox" name="beforeDueDate" checked={filterConstraints.beforeDueDate}
                               defaultChecked={true} onChange={e => setFilterConstraints(prevState => ({
                            ...prevState,
                            [e.target.name]: e.target.checked
                        }))}/>
                    </label>
                    <label>
                        Overdue:
                        <input type="checkbox" name="overdue" checked={filterConstraints.overdue}
                               defaultChecked={true}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        Started:
                        <input type="checkbox" name="started" checked={filterConstraints.started}
                               defaultChecked={true} onChange={e => setFilterConstraints(prevState => ({
                            ...prevState,
                            [e.target.name]: e.target.checked
                        }))}/>
                    </label>
                    <label>
                        Not Started:
                        <input type="checkbox" name="notStarted" checked={filterConstraints.notStarted}
                               defaultChecked={true}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                </div>
            </div>
        </>
    )
}