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
// array of questions for manager parameters
const questionsManager = [{
        type: "input",
        message: "Hi and welcome to the Engineering Team Generator! What is the manager's name?",
        name: "managerName"
    },
    {
        type: "input",
        message: "What is the manager's id?",
        name: "managerId"
    },
    {
        type: "input",
        message: "What is the manager's email address?",
        name: "managerEmail"
    },
    {
        type: "input",
        message: "What is the manager's office number?",
        name: "managerOfficeNumber"
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
    name: "teamMember",
}];
// array of questions for engineer parameters
const questionsEngineer = [{
        type: "input",
        message: "What is the engineer's name?",
        name: "engineerName",
    },
    {
        type: "input",
        message: "What is the engineer's id?",
        name: "engineerId",
    },
    {
        type: "input",
        message: "What is the engineer's email address?",
        name: "engineerEmail",
    },
    {
        type: "input",
        message: "What is the engineer's GitHub username?",
        name: "engineerGitHub",
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
    },
    {
        type: "input",
        message: "What is the intern's id?",
        name: "internId",
    },
    {
        type: "input",
        message: "What is the intern's email address?",
        name: "internEmail",
    },
    {
        type: "input",
        message: "What is the intern's current school?",
        name: "internSchool",
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
// function call to initialize program
init();