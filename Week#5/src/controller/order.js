import connection from '../config/database.js';

const orderController = {
    createOrder: (req, res) => {
        const customer_id = req.params.customer_id;
        const items = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid request body. Expected an array of items.' });
        }
        let total_amount = 0.0;
        // Calculate total amount
        items.forEach(item => {
            total_amount += item.unit_price * item.quantity;
        });
        // Get current date
        const currentDate = new Date().toISOString().slice(0, 10);
        // Insert order
        connection.execute(
            'INSERT INTO orders (customer_id, total_amount, order_date) VALUES (?, ?, ?)',
            [customer_id, total_amount, currentDate],
            (orderInsertErr, orderInsertResult) => {
                if (orderInsertErr) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                const order_id = orderInsertResult.insertId;
                if (!order_id) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                // Function to insert order items
                const insertOrderItems = (index) => {
                    // base case
                    if (index >= items.length) { 
                        return res.status(201).json({ message: 'Order created successfully' });
                    }
                    const item = items[index];
                    // Get product_id for the item
                    connection.execute(
                        'SELECT id FROM products WHERE product_name = ?',
                        [item.product_name],
                        (productErr, productRows) => {
                            if (productErr) {
                                return res.status(500).json({ error: 'Internal Server Error' });
                            }
                            if (productRows.length === 0) {
                                return res.status(404).json({ error: `Product not found: ${item.product_name}` });
                            }
                            const product_id = productRows[0].id;
                            // Insert order item
                            connection.execute(
                                'INSERT INTO orderItems (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                                [order_id, product_id, item.quantity, item.unit_price],
                                (orderItemErr) => {
                                    if (orderItemErr) {
                                        return res.status(500).json({ error: 'Internal Server Error' });
                                    }
                                    // Insert next order item -> recursive call (transition)
                                    insertOrderItems(index + 1);
                                }
                            );
                        }
                    );
                };
                // Start inserting order items
                insertOrderItems(0);
            }
        );
    },
    // API to calculate the average order value.
    getAverageOrderValue: (req, res) => { 
        const query = `
            SELECT order_id, AVG(unit_price * quantity) AS average_order_value 
            FROM orderItems 
            GROUP BY order_id
        `;
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        }); 
    },
    //Write a query to list all customers who have not made any orders.
    getCustomersWithoutOrders: (req, res) => {
        const query = `
            SELECT c.first_name, c.last_name
            FROM customers c
            LEFT JOIN orders o ON c.id = o.customer_id
            WHERE o.id IS NULL
        `;
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    },
    //API to find the customer who has purchased the most items in total.
    getCustomerWithMostItems: (req, res) => {
        const query = `
            SELECT c.first_name, c.last_name, SUM(oi.quantity) AS total_items_purchased
            FROM customers c
            INNER JOIN orders o ON c.id = o.customer_id
            INNER JOIN orderItems oi ON o.id = oi.order_id
            GROUP BY c.first_name, c.last_name
            ORDER BY total_items_purchased DESC
            LIMIT 1
        `;  
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    },
    // API to list the top 10 customers who have spent the most money.
    getTop10Customers: (req, res) => {
        const query = `
            SELECT c.first_name, c.last_name, o.total_amount AS total_spent
            FROM customers c
            INNER JOIN orders o ON c.id = o.customer_id
            GROUP BY c.first_name, c.last_name
            ORDER BY total_spent DESC
            LIMIT 10
        `;
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    },
    // API to list all customers who have made at least 5 orders.
    getCustomersWithAtLeast5Orders: (req, res) => {
        const query = `
            SELECT c.first_name, c.last_name, COUNT(o.id) AS total_orders
            FROM customers c
            INNER JOIN orders o ON c.id = o.customer_id
            GROUP BY c.first_name, c.last_name
            HAVING total_orders >= 5
        `;
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    },
    // API to find the percentage of customers who have made more than one order.
    getPercentageOfCustomersWithMoreThanOneOrder: (req, res) => {
        const query = `
            SELECT 
                (COUNT(DISTINCT more_than_one_order.customer_id) / COUNT(DISTINCT customers.id)) * 100 AS percentage
            FROM customers
            LEFT JOIN (SELECT customer_id
                FROM orders
                GROUP BY customer_id
                HAVING COUNT(*) > 1) AS more_than_one_order
            ON customers.id = more_than_one_order.customer_id;
        `;
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    },
    // API to find the customer who has made the earliest order.
    getCustomerWithEarliestOrder: (req, res) => {
        const query = `
            SELECT c.first_name, c.last_name, o.order_date
            FROM customers c
            INNER JOIN orders o ON c.id = o.customer_id
            ORDER BY o.order_date
            LIMIT 1
        `;
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    }
};

export default orderController;
