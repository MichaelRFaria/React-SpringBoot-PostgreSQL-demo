import '../styles/FilterOptions.css'

// component that displays options to search, sort and filter the tasks table
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
            <div id="taskOptions">
                <div id="taskOptionsContainerLeft">
                    <div id="searching">
                        <label>
                            <h4>Search for Task:</h4>
                            <p>Search for:</p>
                            <input name="searchValue" placeholder="Enter a keyword."
                                   onChange={e => setSearchValue(e.target.value)}/>
                        </label>
                    </div>
                    <div id="sorting">
                        <label>
                            <h4>Sort Tasks:</h4>
                            <p>Sort by:</p>
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
                </div>

                <div id="filtering">
                    <h4>Filter Tasks:</h4>
                    <p>Only show:</p>
                    <label>
                        <p>Completed:</p>
                        <input type="checkbox" name="completed" checked={filterConstraints.completed}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        <p>Uncompleted:</p>
                        <input type="checkbox" name="uncompleted" checked={filterConstraints.uncompleted}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        <p>Started:</p>
                        <input type="checkbox" name="started" checked={filterConstraints.started}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        <p>Not Started:</p>
                        <input type="checkbox" name="notStarted" checked={filterConstraints.notStarted}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        <p>Before due date:</p>
                        <input type="checkbox" name="beforeDueDate" checked={filterConstraints.beforeDueDate}
                               onChange={e => setFilterConstraints(prevState => ({
                                   ...prevState,
                                   [e.target.name]: e.target.checked
                               }))}/>
                    </label>
                    <label>
                        <p>Overdue:</p>
                        <input type="checkbox" name="overdue" checked={filterConstraints.overdue}
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