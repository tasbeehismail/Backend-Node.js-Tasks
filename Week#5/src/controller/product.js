import connection from '../config/database.js';

const productController = {
    addProduct: (req, res) => {
        const { product_name, category, unit_price } = req.body;
        connection.execute('INSERT INTO products (product_name, category, unit_price) VALUES (?, ?, ?)', [product_name, category, unit_price], (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json({ message: 'Product added successfully' });
        });
    },
    // API to find the total revenue generated by each category of products.
    getRevenue: (req, res) => {
        const query = `
            SELECT p.category AS category, SUM(oi.quantity * oi.unit_price) AS total_revenue
            FROM products p
            INNER JOIN orderItems oi ON p.id = oi.product_id
            GROUP BY p.category;
        `;
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    },
    //API to find the total number of items sold for each product.
    getItemsSold: (req, res) => {
        const query = `
            SELECT p.product_name, SUM(oi.quantity) AS total_items_sold
            FROM products p
            INNER JOIN orderItems oi ON p.id = oi.product_id
            GROUP BY p.product_name;
        `;
        connection.execute(query, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json(result);
        });
    }
}

export default productController