CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
productID int PRIMARY KEY auto_increment,
product_name varchar(50),
department_name varchar(50),
price decimal(10,2),
stock_quantity int,
product_sales decimal(10,2)
);
SELECT * FROM products;
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("cat food", "pet supplies", 10.99, 150), 
("cat litter", "pet supplies", 45.50, 50), ("cracking the coding interview", "books", 4, 49.99), ("ear buds", "electronics", 15.99, 1),
("ipad", "electronics", 699.50, 100), ("garden gloves", "home and garden", 5.99, 25), ("batteries", "household goods", 5.99, 100), 
("windex", "household goods", 8.99, 30), ("sunglasses", "apparel", 10.99, 10), ("tshirt", "apparel", 10.99, 50);

CREATE TABLE departments (
departmentID int PRIMARY KEY auto_increment,
department_name varchar(50),
overhead_costs decimal(10,2)
);
INSERT INTO departments (department_name, overhead_costs) VALUES ("electronics", 1500000), ("pet supplies", 25000), ("books", 25000),
("home and garden", 30000), ("household goods", 250);