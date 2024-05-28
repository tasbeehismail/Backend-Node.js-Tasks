import connection from '../config/database.js';
import bcrypt from 'bcrypt';

const customerController = {
    signup: (req, res) => {
        const {first_name, last_name, email, password, phone} = req.body
        connection.execute('SELECT * FROM customers WHERE email = ?', [email], (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            if (result.length > 0) {
                res.status(409).json({ message: 'User already exists' });
            } else {
                const hashedPassword = bcrypt.hashSync(password, 10);
                connection.execute('INSERT INTO customers (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, email, hashedPassword, phone], (err, result) => {
                    if (err) {
                        res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(201).json({ message: 'User created successfully' });
                });
            }
        })
    },
    login: (req, res) => {
        const { email, password } = req.body;
        connection.execute('SELECT * FROM customers WHERE email = ?', [email], (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (result.length > 0) {
                const isPasswordValid = bcrypt.compareSync(password, result[0].password);
                if (isPasswordValid) {
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    res.status(401).json({ message: 'Wrong password!' });
                }
            } else {
                res.status(404).json({ message: 'User does not exist!' });
            }
        });
     }
};
export default customerController;