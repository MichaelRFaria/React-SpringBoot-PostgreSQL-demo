// class of methods send requests to the backend's API endpoints

// simple method to make a GET request to the appropriate API endpoint
export async function getData() {
    const url = "http://localhost:8080/task";

    try {
        // using fetch with just a URL as its parameter makes a GET request, you can add additional params for method, headers, etc.
        // the response variable is part of the Response interface, which provides read only properties for checking HTTP responses
        const response = await fetch(url);
        // the "ok" property is a boolean stating if the response was successful (status codes 200-299)
        if (!response.ok) {
            // the "status" property is the number of the HTTP status code of the response
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error.message);
    }
}

// simple method to make POST and PUT requests to the appropriate API endpoint, using the data from the form element and the ID selected form the dropdown menu
export async function sendData(data, selectedId) {
    // let and var have different scopes, but let also doesn't require initialisation.
    let url;
    let method;

    // === is strict checking, which will not attempt to convert between types unlike ==
    if (selectedId === -1) {
        url = "http://localhost:8080/task"
        method = "POST"
    } else {
        // using backticks makes a "template literal" allowing you to have inline JS vars and more
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

        //const result = await response.json();
        //console.log(result);
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

        console.log(response.status)
        return response.status;
    } catch (error) {
        console.error(error.message);
    }
}