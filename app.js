var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASS,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayInventory();
  promptBuy();
});
//Displays items available for sale
function displayInventory(){
    var query = "SELECT productID, product_name, price FROM products";
    connection.query(query, (err, result) => {
        if(err) throw err;
        for(var i = 0; i < result.length; i++){
            console.log(`ID: ${result[i].productID} || Product: ${result[i].product_name} || Price: ${result[i].price} `)
        }
    })
};
//Prompts user to select the ID number of a product and the amount they wish to purchase
function promptBuy(){
    var query = "SELECT productID FROM products";   
    connection.query(query, (err, result) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name: "getItem",
                type: "list",
                message: "Select the ID number of the product you wish to buy:",
                choices:  function(){
                    var itemsArr = [];
                    for(var i = 0; i < result.length; i++){
                        itemsArr.push(`${result[i].productID}`);
                    }
                    return itemsArr;
                }
            },
            {
                name: "getUnits",
                message: "How many units would you like to purchase?",
                type: "input",
                validate: function(value){
                    if (value.length){
                       return true;                                        
                    } else{
                        return "Sorry, you must enter a quantity";   
                    }               
                }
            }
        ]).then(answer => {
            console.log("Checking to see if enough inventory...");
            checkInventory(answer);            
        })
    })    
};
//Checks to see if enough of that product available
function checkInventory(answer){    
    var query = `SELECT price, stock_quantity FROM products WHERE productID=${answer.getItem}`; 
    connection.query(query, (err, result) => {
        if(err) throw err;
        var price = result[0].price;
        var itemStock = result[0].stock_quantity;          
        if(parseInt(answer.getUnits) > itemStock){
            console.log(`Sorry, we don't have enough of that! You may order up to ${itemStock} units.`);
            promptBuy();
        } else{
            updateDB(answer, itemStock, price);
        }
    })
};
//Updates DB with quantity purchased and displays total to user
function updateDB(answer, stock, price){
    var newQuantity = stock - parseInt(answer.getUnits);
    var getTotal = price * parseInt(answer.getUnits);   
    var query = `UPDATE products SET stock_quantity = ${newQuantity} WHERE productID=${answer.getItem}`;
    connection.query(query, (err) => {
        if(err) throw err;
        console.log(`You're purchase is complete. Your total is $${getTotal}.`);
        nextPrompt();
    })
};
//Asks user if they would like to purchase anything else, else exits connection
function nextPrompt(){
    inquirer.prompt([
        {
            name: "status",
            type: "list",
            message: "Buy more?",
            choices: ["Buy more", "Exit"]
        }
    ]).then(answer => {
        if(answer.status === "Buy more"){
            displayInventory();
            promptBuy();
        } else{
            console.log("Thank you. Goodbye.");
            connection.end();
        }
    })
};