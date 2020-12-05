// require dependencies and relative files
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
// these paths are used in fs.writeFile to target the correct folder locations
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
// render is used to create the html output
const render = require("./lib/htmlRenderer");
// validate function for string responses
// Was getting ReferenceError: Cannot access 'answerValidate' before initialization so moved this function before question arrays. Reference: https://www.npmjs.com/package/inquirer and https://stackoverflow.com/questions/57321266/how-to-test-inquirer-validation
const stringValidate = async input => {
    if (input.trim() === "" || !isNaN(input.trim())) {
        return "Please enter a valid response.";
    } else {
        return true;
    }
}
// validate function for number responses
const numberValidate = async input => {
    if (input.trim() === "" || isNaN(input.trim())) {
        return "Please enter a valid number.";
    } else {
        return true;
    }
}
// validate function for email responses
const emailValidate = async input => {
    if (!input.trim().includes("@") || !input.trim().includes(".com") && !input.trim().includes(".edu") && !input.trim().includes(".net") && !input.trim().includes(".co.uk")) {
        return "Please enter a valid email address.";
    } else {
        return true;
    }
}
// array of questions for manager parameters
const questionsManager = [{
        type: "input",
        message: "Hi and welcome to the Engineering Team Generator! What is the manager's name?",
        name: "managerName",
        validate: stringValidate
    },
    {
        type: "input",
        message: "What is the manager's id number?",
        name: "managerId",
        validate: numberValidate
    },
    {
        type: "input",
        message: "What is the manager's email address?",
        name: "managerEmail",
        validate: emailValidate
    },
    {
        type: "input",
        message: "What is the manager's office number?",
        name: "managerOfficeNumber",
        validate: numberValidate
    },
    {
        type: "confirm",
        message: "Do you want to add any more employees that work under this manager?",
        name: "addBool",
        default: true
    }
];
// array holding one question to determine if user wants to add more employees
const addEmployee = [{
    type: "list",
    message: "What kind of employee do you want to add that works under this manager?",
    choices: ["Engineer", "Intern", "None"],
    name: "teamMember"
}];
// array of questions for engineer parameters
const questionsEngineer = [{
        type: "input",
        message: "What is the engineer's name?",
        name: "engineerName",
        validate: stringValidate
    },
    {
        type: "input",
        message: "What is the engineer's id number?",
        name: "engineerId",
        validate: numberValidate
    },
    {
        type: "input",
        message: "What is the engineer's email address?",
        name: "engineerEmail",
        validate: emailValidate
    },
    {
        type: "input",
        message: "What is the engineer's GitHub username?",
        name: "engineerGitHub",
        validate: stringValidate
    },
    {
        type: "confirm",
        message: "Do you want to add any more employees that work under this manager?",
        name: "addBool",
        default: true
    }
];
// array of questions for intern parameters
const questionsIntern = [{
        type: "input",
        message: "What is the intern's name?",
        name: "internName",
        validate: stringValidate
    },
    {
        type: "input",
        message: "What is the intern's id number?",
        name: "internId",
        validate: numberValidate
    },
    {
        type: "input",
        message: "What is the intern's email address?",
        name: "internEmail",
        validate: emailValidate
    },
    {
        type: "input",
        message: "What is the intern's current school?",
        name: "internSchool",
        validate: stringValidate
    },
    {
        type: "confirm",
        message: "Do you want to add any more employees that work under this manager?",
        name: "addBool",
        default: true
    }
];
// define empty output array to hold employee objects
const output = [];
// function to initialize program. this function uses the questionsManager array and pushes the responses into the output array. uses addBool to determine if the user wants to add another employee, else call the render function
const init = () => {
    inquirer.prompt(questionsManager).then(response => {
        response.managerName = capLetters(response.managerName);
        const manager = new Manager(response.managerName, response.managerId, response.managerEmail, response.managerOfficeNumber)
        output.push(manager);
        if (response.addBool) {
            addEmployeeFunc();
        } else {
            renderOut();
        }
    }).catch((e) => { // was getting UnhandledPromiseRejectionWarning so added this catch(). reference https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261
        console.log(e)
    });
}
// this function is called when the user wants to add another employee. uses if statement to determine if engineer or intern and calls corresponding function
const addEmployeeFunc = () => {
    inquirer.prompt(addEmployee).then(response => {
        if (response.teamMember === "Engineer") {
            engineer();
        } else if (response.teamMember === "Intern") {
            intern();
        } else {
            renderOut();
        }
    }).catch((e) => {
        console.log(e)
    });
}
// this function is called when the user wants to add another engineer employee. adds user responses to the output array and checks if the user wants to keep adding more employees, else call render function
const engineer = () => {
    inquirer.prompt(questionsEngineer).then(response => {
        response.engineerName = capLetters(response.engineerName);
        const engineer = new Engineer(response.engineerName, response.engineerId, response.engineerEmail, response.engineerGitHub)
        output.push(engineer);
        if (response.addBool) {
            addEmployeeFunc();
        } else {
            renderOut();
        }
    }).catch((e) => {
        console.log(e)
    });
}
// this function is called when the user wants to add another intern employee. adds user responses to the output array and checks if the user wants to keep adding more employees, else call render function
const intern = () => {
    inquirer.prompt(questionsIntern).then(response => {
        response.internName = capLetters(response.internName);
        response.internSchool = capLetters(response.internSchool);
        const intern = new Intern(response.internName, response.internId, response.internEmail, response.internSchool)
        output.push(intern);
        if (response.addBool) {
            addEmployeeFunc();
        } else {
            renderOut();
        }
    }).catch((e) => {
        console.log(e)
    });
}
// this function is called when the user no longer wants to add more employees. sends output array to render function and uses response as the data parameter for fs.writeFile
const renderOut = () => {
    const renderOutput = render(output);
    fs.writeFile(outputPath, renderOutput, err => {
        if (err) {
            return console.log(err);
        }
        console.log("Success!");
    });
}
// this function capitalizes the first letter in each word of a string except for the word "of" i.e. university of washington => University of Washington
const capLetters = str => {
    let arrayStr = str.split(" ");
    let capLetter = "";
    let newString = "";
    for (let i = 0; i < arrayStr.length; i++) {
        if (arrayStr[i].toLowerCase() === "of") {
            newString += "of ";
        } else {
            capLetter = arrayStr[i][0].toUpperCase();
            newString += capLetter + arrayStr[i].slice(1, arrayStr[i].length).toLowerCase() + " ";
        }
    }
    return newString.trim();
}
// function call to initialize program
init();