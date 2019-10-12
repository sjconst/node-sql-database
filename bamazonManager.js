var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

var departments = ["pet supplies", "toys and games", "electronics", "groceries", "office supplies", "home and kitchen", "health and household", "arts and crafts", "baby", "beauty", "books", "patio and garden", "sports and outdoors"]

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
            name: "selection",
            type: "list",
            message: "what do you wish to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(answer => {
        if(answer.selection === "View Products for Sale"){
            listItems();
        } else if(answer.selection === "View Low Inventory"){
            viewLowInventory();
        } else if(answer.selection === "Add to Inventory"){
            addInventory();
        } else if(answer.selection === "Add New Product"){
            addProduct();
        } else{
            connection.end()
        }
    })
}
// List every available item: the item IDs, names, prices, and quantities.
function listItems(){
    var query = "SELECT * FROM products ORDER BY department_name"
    connection.query(query, (err, result) => {
        if(err) throw err;
        for(var i = 0; i < result.length; i++){
            console.log(`ID: ${result[i].productID} || Name: ${result[i].product_name} || Department: ${result[i].department_name} || Price: ${result[i].price} || Quantity: ${result[i].stock_quantity} || Current Sales: ${result[i].product_sales}`)
        }
        displayOptions();
    })
}

//List all items with an inventory count lower than five.
function viewLowInventory(){
    var query = "SELECT * FROM products WHERE stock_quantity < 5"
    connection.query(query, (err, result) => {
        if(err) throw err;
        for(var i = 0; i < result.length; i++){
            console.log(`ID: ${result[i].productID} || Name: ${result[i].product_name} || Department: ${result[i].department_name} || Price: ${result[i].price} || Quantity: ${result[i].stock_quantity}`)
        }
        displayOptions();
    })
}

// Display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory(){
    var query = "SELECT * FROM products";
    connection.query(query, (err, result) => {
        if(err) throw err;        
        inquirer.prompt([
            {
                name: "pickItem",
                message: "What item do you wish to add inventory to?",
                type: "list",
                choices: function(){
                    var choiceArr = [];
                    for(var i = 0; i < result.length; i++){
                        choiceArr.push(result[i].product_name)
                    }
                    return choiceArr;
                }
            }, 
            {
                name: "addQuant",
                message: "How much?",
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
            var addQuant = parseInt(answer.addQuant); 
            var chosenItem;
            var currentQuant;
            //get the information of the chosen item
            for(var i = 0; i < result.length; i++){
                if(result[i].product_name === answer.pickItem){
                    chosenItem = result[i].productID;
                    currentQuant = result[i].stock_quantity;
                }
            }
            var query = `UPDATE products SET stock_quantity=${currentQuant + addQuant} WHERE productID=${chosenItem}`;            
            connection.query(query, (err, result) => {
                if(err) throw err;
                console.log(`Quantity updated. You now have ${currentQuant + addQuant} of ${answer.pickItem}`);              
                displayOptions();
            })
        })
    })    
}

//Allow the manager to add a completely new product to the store.
function addProduct(){
    connection.query("SELECT * FROM products", (err, result) => {
        //get list of current items
        var currentItems = [];
        for(var i = 0; i < result.length; i++){
            currentItems.push(result[i].product_name)
        }
        if(err) throw err;
        inquirer.prompt([
            {
                name: "product_name",
                type: "input",
                message: "Product name: ",
                validate: function(value){                              
                    if ((value !== "") && (currentItems.includes(value.toLowerCase()) === false)){
                       return true;                                        
                    } else {
                        return "Sorry, you either didn't enter a name or that product already exists.";   
                    }               
                },
            },
            {
                name: "department_name",
                type: "list",
                message: "Department: ",
                choices: departments
            },
            {
                name: "price",
                type: "input",
                message: "Unit price: ",
                validate: function(value){
                    if (value.length){
                       return true;                                        
                    } else{
                        value = 0;
                        return value;   
                    }               
                }
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "Stock quantity: ",
                validate: function(value){
                    if (value.length){
                       return true;                                        
                    } else{
                        value = 0;
                        return value;   
                    }               
                }
            }
        ]).then(answer => {
            lowerName = answer.product_name.toLowerCase();
            lowerDept = answer.department_name.toLowerCase();
            var query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${lowerName}", "${lowerDept}", ${answer.price}, ${answer.stock_quantity})`;          
            connection.query(query, (err) => {
                if(err) throw err;
                console.log("Item added")
                displayOptions();
            })        
            }
        )

    })
    
}