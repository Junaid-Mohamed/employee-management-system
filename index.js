// using immpor as I've added type:module in package.json file.
import readlineSync from "readline-sync";
import fs from "fs";
import chalk from "chalk";
import readline from "readline";

// console.log(chalk.blue("This is blue output."))
// console.clear();

// customisation using chalk.

const errorColor = chalk.bold.redBright;
const successColor = chalk.bold.greenBright;
const customTextColor = chalk.bold.cyanBright;
const warningColor = chalk.bold.yellowBright;
const questionColor = chalk.bold.magentaBright;

let employeeList = [];

// utility functions

// read employee details from file.
function readFromEmployeeListFile() {
  try {
    const employeeListFileData = fs.readFileSync("employeeList.txt", "utf-8");
    employeeList = JSON.parse(employeeListFileData);
  } catch (error) {
    // In the context of file operations in Node.js, ENOENT stands for "Error NO ENTry" and is an error       code that indicates that a specified file or directory does not exist.
    if (error.code === "ENOENT") {
      writeToEmployeeListFile([]);
    } else {
      console.log(errorColor(`Error while reading file: ${error}`));
    }
  }
}

// updated details to be written to file.
function writeToEmployeeListFile() {
  try {
    const employeeListLocalData = JSON.stringify(employeeList, null, 2);
    fs.writeFileSync("employeeList.txt", employeeListLocalData, "utf-8");
  } catch (error) {
    console.log(errorColor(`Error while writing to file: ${error}`));
  }
}

// generate a 5 digit unique emp id using Math.random
function generateUniqueEmpId() {
  return Math.floor(Math.random() * 90000 + 10000);
}

// get confirmation for update/delete;
function getConfirmation(question) {
  const userChoice = readlineSync.question(warningColor(`${question} (y/n)`));
  if (userChoice.toLowerCase() === "y") return true;
  else if (userChoice.toLocaleLowerCase() === "n") return false;
  else {
    console.log(errorColor("Invalid input. Please enter y or n."));
    return getConfirmation(question);
  }
}

// get employee list preview
function getEmployeeListPreview() {
  // console.log("\nEmployee List preview");
  employeeList.forEach((emp) =>
    console.log(
      customTextColor(`\nEmp Name : ${emp.name} Emp Id : ${emp.empId}`)
    )
  );
}

// get employee details to add employee
function getEmployeeDetails() {
  // const empId = Number(readlineSync.question("Please enter the EMP ID : "));
  const empId = generateUniqueEmpId();
  const name = readlineSync.question(
    questionColor("Please enter the EMP NAME : ")
  );
  const age = readlineSync.question(
    questionColor("Pleae enter the EMP AGE : ")
  );
  const designation = readlineSync.question(
    questionColor("Please enter the EMP DESIGNATION : ")
  );
  return {
    empId,
    name,
    age,
    designation,
  };
}

// update emplyee details
function updateEmployeeDetails(empId) {
  const index = findEmpId(empId);
  if (index !== -1) {
    console.log(customTextColor("\nPlease enter employee details to update."));
    const name = readlineSync.question(
      questionColor("Please enter the EMP NAME : ")
    );
    const age = readlineSync.question(
      questionColor("Pleae enter the EMP AGE : ")
    );
    const designation = readlineSync.question(
      questionColor("Please enter the EMP DESIGNATION : ")
    );
    const confirm = getConfirmation(
      "Are you sure you want to udpate the Employee Details ?"
    );
    if (confirm) {
      employeeList[index].name = name;
      employeeList[index].age = age;
      employeeList[index].designation = designation;
      writeToEmployeeListFile();
      console.log(successColor("\nEmployee details updated successfully."));
    } else {
      console.log(errorColor("\nEmployee details not updated."));
    }
  } else {
    console.log(errorColor("\nEmployee Id not found to update."));
  }
}

function findEmpId(id) {
  return employeeList.findIndex((emp) => emp.empId === id);
}

// -----------------------------------------------------------------------------------------

// add employee
function addEmployee() {
  console.log(customTextColor("\nAdd New Employee: \n"));
  const emp = getEmployeeDetails();
  employeeList.push(emp);
  writeToEmployeeListFile();
  console.log(successColor("\nEmployee added successfully."));
}

// view employee List

function viewEmployeeList() {
  // read emplist file here or in the main function.
  console.log(customTextColor("\nEmployee List : "));
  employeeList.forEach((employee) => {
    console.log(
      customTextColor(`
    Emp ID : ${employee.empId}
    Emp Name : ${employee.name}
    Emp Age : ${employee.age}
    Emp Designation : ${employee.designation}
    `)
    );
  });
}

// search employee

function searchEmployee() {
  const empId = Number(
    readlineSync.question(
      questionColor("\nPlease enter employee Id to search: ")
    )
  );
  // console.log(typeof empId);
  const index = findEmpId(empId);
  // console.log(index);
  if (index !== -1) {
    console.log(
      customTextColor(`
    Emp ID : ${employeeList[index].empId}
    Emp Name : ${employeeList[index].name}
    Emp Age : ${employeeList[index].age}
    Emp Designation : ${employeeList[index].designation}
    `)
    );
  } else {
    console.log(errorColor("\nEmployee Id not found"));
  }
}

// update employee
function updateEmployee() {
  console.log(
    questionColor("\nPlease select employee id from the preview to update : ")
  );
  getEmployeeListPreview();
  const empIdToUpdate = Number(
    readlineSync.question(questionColor("\nPlease enter the empId to update: "))
  );
  updateEmployeeDetails(empIdToUpdate);
}

// delete employee details

function deleteEmployee() {
  console.log(
    questionColor("\nPlease select employee id from the preview to delete : ")
  );
  getEmployeeListPreview();
  const empIdToDelete = Number(
    readlineSync.question(questionColor("\nPlease enter the empId to delete: "))
  );
  const index = findEmpId(empIdToDelete);
  if (index !== -1) {
    const confirm = getConfirmation(
      "Are you sure you want to delete the Employee Details ?"
    );
    if (confirm) {
      employeeList.splice(index, 1);
      writeToEmployeeListFile();
      console.log(successColor("\nEmployee deleted successfully"));
    } else {
    }
  } else {
    console.log(errorColor("\nEmployee Id not found to delete."));
  }
}

// function to handle user input

const userInputOptions = [
  "add employee",
  "view employee list",
  "search employee",
  "update employee",
  "delete employee",
  "exit",
];

const userInputOptionsColor = userInputOptions.map((option) =>
  questionColor(option)
);

// console.log(userInputOptionsColor);

function handleUserInput() {
  const userInput = readlineSync.keyInSelect(
    userInputOptionsColor,
    questionColor("Please select an option from above perform an action: \n"),
    { cancel: false }
  );
  // process the input
  if (userInput === 0) {
    // console.log("add employee")
    addEmployee();
    // handleUserInput();
  } else if (userInput === 1) {
    viewEmployeeList();
  } else if (userInput === 2) {
    searchEmployee();
  } else if (userInput === 3) {
    updateEmployee();
  } else if (userInput === 4) {
    deleteEmployee();
  } else if (userInput === 5) {
    console.log(
      customTextColor(
        "\nExiting the program.\nThank you for using Employee Management System."
      )
    );
  }
}

// main function

function main() {
  console.log(
    customTextColor("Welcome to Employee Management System (CLI program)")
  );
  readFromEmployeeListFile();
  handleUserInput();
  let userChoice;
  while (1) {
    userChoice = readlineSync.question(
      questionColor("\nDo you want to continue? (y/n) : ")
    );
    if (userChoice.toLowerCase() === "y") handleUserInput();
    else if (userChoice.toLowerCase() === "n") {
      console.log(
        customTextColor(
          "\nExiting the program.\nThank you for using Employee Management System."
        )
      );
      break;
    } else console.log(warningColor("\nPlease give a valid input!! (y/n)"));
  }
}

// start the program
main();
