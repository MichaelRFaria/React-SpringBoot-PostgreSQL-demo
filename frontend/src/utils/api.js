// class of methods send requests to the backend's API endpoints

// simple method to make a GET request to the appropriate API endpoint
export async function getData() {
    const url = "http://localhost:8080/task";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        //console.log(result);
        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

// simple method to make POST and PUT requests to the appropriate API endpoint, using the data from the form element and the ID selected form the dropdown menu
export async function sendData(data, selectedId) {
    let url;
    let method;

    if (selectedId === -1) {
        url = "http://localhost:8080/task"
        method = "POST"
    } else {
        url = `http://localhost:8080/task/${selectedId}`
        method = "PUT"
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }


        return response.status;
    } catch (error) {
        console.error(error.message);
    }
}

// simple method to make DELETE requests to the appropriate API endpoint, based on the ID selected form the dropdown
// returns the HTTP response status code (200-299 = success)
export async function deleteData(selectedId) {
    const url = `http://localhost:8080/task/${selectedId}`

    try {
        const response = await fetch(url, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return response.status;
    } catch (error) {
        console.error(error.message);
    }
}

export async function deleteAllData() {
    const url = "http://localhost:8080/task"

    try {
        const response = await fetch(url, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return response.status;
    } catch (error) {
        console.error(error.message);
    }
}