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
export async function sendData(form, selectedId) {
    // "When specified with a <form> element, the FormData object will be populated with the form's current keys/values,
    // using the name property of each element for the keys and their submitted value for the values."
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // let and var have different scopes, but let also doesn't require initialisation.
    let url;
    let method;

    // === is strict checking, which will not attempt to convert between types unlike ==
    if (selectedId === "new") {
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

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

// simple method to make DELETE requests to the appropriate API endpoint, based on the ID selected form the dropdown
export async function deleteData(selectedId) {
    const url = `http://localhost:8080/task/${selectedId}`

    if (selectedId === "new") {
        console.log("cannot delete on id 'new' pick an existing id from the dropdown")
        return;
    }

    try {
        const response = await fetch(url, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
}