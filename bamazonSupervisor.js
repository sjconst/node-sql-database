var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
var Table = require('easy-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASS,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayOptions();
});

function displayOptions(){
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments", "View product sales by department", "Create new department", "Exit"]
        }
    ]).then(answer => {
        if(answer.options === "View product sales by department"){
            viewSales();
        } else if(answer.options === "Create new department"){
            createDPT();
        } else if(answer.options === "View all departments"){
            viewAll();
        } else{
            connection.end();
        }        
    })
}
function viewAll(){
    var query = "SELECT * FROM departments";
    connection.query(query, (err, result) => {
        if(err) throw err;
        var t = new Table;    
        for(var i = 0; i < result.length; i++){
            var totalProfit = result[i].product_sales - result[i].overhead_costs;
            t.cell("Department ID", result[i].departmentID);
            t.cell("Department Name", result[i].department_name);
            t.cell("Overhead Costs", result[i].overhead_costs);           
            t.newRow();    
        };
        console.log(t.toString())
        displayOptions();
    })
}
function viewSales(){
    var query = `SELECT departmentID, departments.department_name, overhead_costs, product_sales FROM departments JOIN products ON departments.department_name = products.department_name GROUP BY departmentID`;  
    connection.query(query, (err, result) => {
        if(err) throw err;
        var t = new Table;    
        for(var i = 0; i < result.length; i++){
            var totalProfit = result[i].product_sales - result[i].overhead_costs;
            t.cell("Department ID", result[i].departmentID);
            t.cell("Department Name", result[i].department_name);
            t.cell("Overhead Costs", result[i].overhead_costs);
            t.cell("Product Sales", result[i].product_sales);
            t.cell("Total Profit", totalProfit);
            t.newRow();    
        };
        console.log(t.toString())
        displayOptions();
    })
}

function createDPT(){
    var query = "SELECT * FROM departments";
    currentDpts = [];
    connection.query(query, (err, result) => {
        if(err) throw err;   
        for(var i = 0; i < result.length; i++){
            currentDpts.push(result[i].department_name)
        }
        inquirer.prompt([
            {
                name: "dptName",
                message: "New department name: ",
                type: "input",
                validate: function(value){                              
                    if ((value !== "") && (currentDpts.includes(value.toLowerCase()) === false)){
                       return true;                                       
                    } else {
                        return "Sorry, you either didn't enter a name or that department already exists.";   
                    }               
                },
            }, 
            {
                name: "dptCost",
                message: "Department overhead cost:",
                type: "input"
            }
        ]).then(answer => {
            var query = `INSERT INTO departments (department_name, overhead_costs) VALUES ('${answer.dptName}', ${parseInt(answer.dptCost)})`;           
            connection.query(query, (err) => {
                if(err) throw err;
                console.log("Department successfully added");
                displayOptions();
            })
        })
    })   
}