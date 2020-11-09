const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// array of questions for user
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

const addEmployee = [{
    type: "list",
    message: "What kind of employee do you want to add that works under this manager?",
    choices: ["Engineer", "Intern", "None"],
    name: "teamMember",
}];

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

const output = [];

// function to initialize program
function init() {
    inquirer.prompt(questionsManager).then(function (response) {
        const manager = new Manager(response.managerName, response.managerId, response.managerEmail, response.managerOfficeNumber)
        output.push(manager);
        if (response.addBool) {
            addEmployeeFunc();
        } else {
            renderOut();
        }
    }).catch((e) => {
        console.log(e)
    });
}

function addEmployeeFunc() {
    inquirer.prompt(addEmployee).then(function (response) {
        if (response.teamMember === "Engineer") {
            engineer();
        } else if (response.teamMember === "Intern") {
            intern();
        }
    }).catch((e) => {
        console.log(e)
    });
}

function engineer() {
    inquirer.prompt(questionsEngineer).then(function (response) {
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

function intern() {
    inquirer.prompt(questionsIntern).then(function (response) {
        const intern = new Intern(response.internName, response.internId, response.internEmail, response.internSchool)
        output.push(intern);
        if (response.addBool) {
            addEmployeeFunc();
        } else {
            renderOut();
        }
    }).catch(() => {});
}

function renderOut() {
    console.log("test render function call");
    console.log(output);
    const renderOutput = render(output);
    console.log(renderOutput);
    fs.writeFile(outputPath, renderOutput, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Success!");
    });
}

// function call to initialize program
init();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above to target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```