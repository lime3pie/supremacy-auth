const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// База данных в памяти (тестовые аккаунты + ваш админ)
let usersDB = {
    "admin": "admin_secret", // Админский аккаунт для управления
    "user1": "pass123",
    "user2": "qwerty"
};

// 1. Эндпоинт для входа (авторизации)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!usersDB[username] || usersDB[username] !== password) {
        return res.status(401).json({ success: false, message: "Неверный логин или пароль" });
    }

    // Проверяем, админ ли это
    const role = (username === 'admin') ? 'admin' : 'user';

    res.json({ 
        success: true, 
        role: role,
        message: "Успешный вход" 
    });
});

// 2. Эндпоинт для получения списка всех пользователей (только для админа)
app.get('/api/users', (req, res) => {
    // В простейшем варианте передаем список логинов (кроме самого админа, если нужно)
    const userList = Object.keys(usersDB).filter(u => u !== 'admin');
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
