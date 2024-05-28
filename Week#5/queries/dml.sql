-- Insert data into customers
INSERT INTO `customers` (`first_name`, `last_name`, `email`, `phone`, `password`) VALUES
('Sara', 'Ismail', 'sara.ismail@example.com', '1234567890', 'password1'),
('Anas', 'Ismail', 'jane@example.com', '0987654321', 'password2'),
('Wafaa', 'Abd-elwahed', 'wafaa@example.com', '1122334455', 'password3');

-- Insert data into products
INSERT INTO `products` (`product_name`, `category`, `unit_price`) VALUES
('Laptop', 'Electronics', 999.99),
('Smartphone', 'Electronics', 499.99),
('Tablet', 'Electronics', 299.99),
('Headphones', 'Accessories', 99.99),
('Keyboard', 'Accessories', 49.99),
('Mouse', 'Accessories', 29.99),
('Chair', 'Furniture', 199.99),
('Desk', 'Furniture', 249.99),
('Monitor', 'Electronics', 199.99),
('Printer', 'Electronics', 149.99);

-- Insert data into orders
INSERT INTO `orders` (`customer_id`, `order_date`, `total_amount`) VALUES
(1, '2024-05-01', 1249.98),
(2, '2024-05-05', 579.98),
(3, '2024-05-10', 369.98),
(1, '2024-05-15', 349.98),
(2, '2024-05-20', 149.99);

-- Insert data into orderItems
INSERT INTO `orderItems` (`order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 1, 999.99),  -- Order 1: 1 Laptop
(1, 4, 2, 99.99),   -- Order 1: 2 Headphones
(2, 2, 1, 499.99),  -- Order 2: 1 Smartphone
(2, 6, 2, 29.99),   -- Order 2: 2 Mouse
(3, 3, 1, 299.99),  -- Order 3: 1 Tablet
(3, 5, 2, 49.99),   -- Order 3: 2 Keyboard
(4, 7, 1, 199.99),  -- Order 4: 1 Chair
(4, 8, 1, 249.99),  -- Order 4: 1 Desk
(5, 10, 1, 149.99); -- Order 5: 1 Printer