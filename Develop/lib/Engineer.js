// define and export the Engineer class. This class inherits from the Employee class.
const Employee = require("./Employee");

class Engineer extends Employee {
    constructor(name, id, email, github) {
        super(name, id, email);
        this.github = github;
    }
    getGithub() {
        return this.github;
    }
    getRole() {
        return Engineer.name;
    }
}

module.exports = Engineer;