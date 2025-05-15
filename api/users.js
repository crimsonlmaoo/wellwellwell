// api/users.js rs
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../users.json');

const loadUsers = () => {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

module.exports = async (req, res) => {
    const users = loadUsers();

    if (req.method === 'POST') {
        const { username, password } = req.body;

        if (req.url === '/login') {
            // Login
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                return res.status(200).json({ success: true, user });
            }
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        if (req.url === '/register') {
            // Registration
            if (users.find(u => u.username === username)) {
                return res.status(400).json({ message: 'Username already exists.' });
            }

            users.push({ username, password });
            saveUsers(users);
            return res.status(201).json({ success: true, message: 'Account created.' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
