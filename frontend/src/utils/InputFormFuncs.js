// function to replace empty input boxes with values from the existing task, when updating

export function replaceEmptyFields(formData, selectedId, tasks) {
    let index = -1;

    for (let i = 0; i < tasks.length; i++) {
        if (parseInt(tasks[i].id) === selectedId) {
            index = i;
            break;
        }
    }

    const task = tasks[index];
    // array of values of the existing task's properties
    const values = [task.title, task.description, task.status, task.priority, task.startDate, task.dueDate]

    // 2d-array of key/value pairs (field name -> value)
    let arr = Array.from(formData);

    for (const key in arr) {
        const value = arr[key][1];
        if (value === null || value.length === 0 || value.trim === "") {
            arr[key][1] = values[key];
        }
    }

    // our API handles JS objects
    return Object.fromEntries(arr);
}

// function to display a message corresponding to the status code produced by an HTTP method

export function displayHTTPStatusMessage(status, selectedMethod) {
    const action = selectedMethod + "d"; // getting the correct verb - "created", "updated", "deleted"

    if (status >= 200 && status <= 299) {
        return `Task successfully ${action}`;
    } else if (status >= 400 && status <= 499) {
        return "Client-side error encountered, please try again";
    } else if (status >= 500 && status <= 599) {
        return "Server-side error encountered, please try again";
    } else {
        return "Error encountered, please try again";
    }
}

