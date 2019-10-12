# node-sql-database

A three-part node application that lets you query a mySQL database in three different ways:
* Use the app.js node application to select products to buy, reducing the products stock quantity in the database 

![bamazon1](https://user-images.githubusercontent.com/42453320/66707572-6198ec80-ecf7-11e9-92f4-bc3896b811cf.gif)

* Use the manager application to add inventory and products to the database

![bamazon2](https://user-images.githubusercontent.com/42453320/66707573-6c538180-ecf7-11e9-885c-fdc5c1dded02.gif)

* Use the supervisor application to view department sales and overhead costs, and create departments

![bamazon3](https://user-images.githubusercontent.com/42453320/66707576-79707080-ecf7-11e9-8be8-5f53a8e32d02.gif)

## Getting Started

To use the app and this code, you'll need your own database. Create the database and its tables in a RBMS like mySQL workbench, and swap out the relevant fields at connection. The sql file is included to help you get started. See npm packages required below and in package.json

## Technical Approach

* Sequencing of inquirer prompts and database queries, and where to close the connection, were key, as all apps prompt the user and query the database often and at different points. 
* Parsing database results - and using the results to prompt and then fetch another query

### Note the various validation methods in inquirer, including checking for two parameters and making sure duplicate records not created
```
validate: function(value){                              
    if ((value !== "") && (currentDpts.includes(value.toLowerCase()) === false)){
        return true;                                       
    } else {
            return "Sorry, you either didn't enter a name or that department already exists.";   
        }               
    }
    
```
```
validate: function(value){
    if (value.length){
        return true;                                        
    } else{
        value = 0;
        return value;   
    }               
}

```

## Technologies Used

* JavaScript
* Node.js
* Inquirer from npm
* Easy-table from npm
* Dotenv from npm
* mySQL + mySQL Workbench

## Authors

* Stephanie Lake - (https://github.com/sjconst)