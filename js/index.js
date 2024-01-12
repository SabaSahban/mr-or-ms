// The API URL to send requests
const apiUrl = "https://api.genderize.io/";

// Global variables
let serverOutput;
let oldName;

// Shows an error message on the webpage using a <p> tag and removes it after 5 seconds
function showError(errorContent) {
    const errorElement = document.getElementById("error");
    errorElement.innerHTML = errorContent;
    setTimeout(() => errorElement.innerHTML = "", 5000);
}

// Fetches gender data from the API and returns the JSON response
async function getGenderFromAPI(name) {
    try {
        const response = await fetch(`${apiUrl}?name=${name}`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const json = await response.json();
        if (json.gender == null) {
            showError("Name not found on server");
            return null;
        }
        return json;
    } catch (error) {
        console.error(error);
        showError("An error occurred while fetching data");
    }
}

// Validates input by length and regex
function validateInput() {
    const input = document.getElementById("name").value;
    if (!input) return "Enter a name";

    const lengthError = input.length > 255 ? "Input too big. " : "";
    const regexError = /^[a-zA-Z\s]*$/.test(input) ? "" : "Only English alphabet and space are allowed.";

    return lengthError + regexError;
}

// Clears the output section and sends request to get gender data
async function sendRequest(e) {
    e.preventDefault();
    clearOutput();

    const name = document.getElementById("name").value;
    const validationError = validateInput();
    if (validationError) return showError(validationError);

    oldName = name;
    const data = await getGenderFromAPI(name);
    if (data) {
        serverOutput = data;
        handleOutputData(data);
    }
}

// Handles the display of saved data and API data
function handleOutputData(data) {
    showSavedData(data.name);
    showAPIData(data);
}

// Saves data either declared by client or from server
function saveData() {
    const validationError = validateInput();
    if (validationError) return showError(validationError);

    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender-male").checked ? "male"
        : document.getElementById("gender-female").checked ? "female"
        : serverOutput.gender;

    if (oldName === name) document.getElementById("saved-data").innerHTML = gender;
    window.localStorage.setItem(name, gender);
}

// Clears specific data from local storage
function clearSavedData() {
    const name = document.getElementById("name").value;
    window.localStorage.removeItem(name);
    if (oldName === name) clearOutput();
}

// Shows saved data from local storage
function showSavedData(name) {
    const gender = window.localStorage.getItem(name);
    if (gender) document.getElementById("saved-data").innerHTML = gender;
}

// Shows API data
function showAPIData(data) {
    if (data.gender) {
        document.getElementById("api-data").innerHTML = data.gender;
        document.getElementById("prob").innerHTML = data.probability;
    }
}

// Clears the output areas
function clearOutput() {
    document.getElementById("saved-data").innerHTML = "";
    document.getElementById("api-data").innerHTML = "";
    document.getElementById("prob").innerHTML = "";
    const radios = document.getElementsByName("gender");
    radios.forEach(radio => radio.checked = false);
}

// Event Listeners
document.getElementById("submit").addEventListener('click', sendRequest);
document.getElementById("save").addEventListener('click', saveData);
document.getElementById("clear").addEventListener('click', clearSavedData);
document.getElementById("name").addEventListener('input', () => showError(validateInput()));
