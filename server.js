const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// База данных и роли в памяти
let usersDB = {
    "admin": "admin_secret",
    "user1": "pass123",
    "user2": "qwerty"
};

// Хранилище ролей (по умолчанию все, кроме admin — это 'user')
let userRoles = {
    "user1": "user",
    "user2": "user"
};

// 1. Эндпоинт для входа (авторизации)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!usersDB[username] || usersDB[username] !== password) {
        return res.status(401).json({ success: false, message: "Неверный логин или пароль" });
    }

    // Определяем роль (если в базе админ или прописано в userRoles)
    const role = (username === 'admin' || userRoles[username] === 'admin') ? 'admin' : 'user';

    res.json({ 
        success: true, 
        role: role,
        message: "Успешный вход" 
    });
});

// 2. Эндпоинт для получения списка всех пользователей (только для админа)
app.get('/api/users', (req, res) => {
    const userList = Object.keys(usersDB)
        .filter(u => u !== 'admin')
        .map(u => ({
            username: u,
            role: userRoles[u] || 'user'
        }));
    res.json({ success: true, users: userList });
});

// 3. Эндпоинт для добавления нового пользователя (только для админа)
app.post('/api/users/add', (req, res) => {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword) {
        return res.status(400).json({ success: false, message: "Заполните логин и пароль" });
    }

    if (usersDB[newUsername]) {
        return res.status(400).json({ success: false, message: "Такой пользователь уже существует" });
    }

    usersDB[newUsername] = newPassword;
    res.json({ success: true, message: `Пользователь ${newUsername} добавлен` });
});

// 4. Эндпоинт для удаления пользователя (мгновенное закрытие доступа)
app.post('/api/users/delete', (req, res) => {
    const { usernameToDelete } = req.body;

    if (!usernameToDelete || usernameToDelete === 'admin') {
        return res.status(400).json({ success: false, message: "Нельзя удалить этого пользователя" });
    }

    if (usersDB[usernameToDelete]) {
        delete usersDB[usernameToDelete];
        return res.json({ success: true, message: `Доступ для ${usernameToDelete} закрыт` });
    }

    res.status(404).json({ success: false, message: "Пользователь не найден" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
// Эндпоинт для изменения роли пользователя (например, сделать админом)
app.post('/api/users/role', (req, res) => {
    const { usernameToUpdate, newRole } = req.body;

    if (!usernameToUpdate || usernameToUpdate === 'admin') {
        return res.status(400).json({ success: false, message: "Нельзя изменить роль этого пользователя" });
    }

    if (!['user', 'admin'].includes(newRole)) {
        return res.status(400).json({ success: false, message: "Некорректная роль" });
    }

    if (usersDB[usernameToUpdate]) {
        // Мы можем хранить роли в отдельном объекте или прямо в логике. 
        // Давайте сделаем простой объект ролей на сервере рядом с usersDB:
        userRoles[usernameToUpdate] = newRole;
        return res.json({ success: true, message: `Роль пользователя ${usernameToUpdate} изменена на ${newRole}` });
    }

    res.status(404).json({ success: false, message: "Пользователь не найден" });
});
