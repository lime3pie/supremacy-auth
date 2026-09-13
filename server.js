const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// База данных пользователей (логин: пароль)
let usersDB = {
    "admin": "admin_secret", // Можете поменять пароль на свой здесь
    "user1": "pass123",
    "user2": "qwerty"
};

// Хранилище ролей пользователей
let userRoles = {
    "user1": "user",
    "user2": "user"
};

// 1. Авторизация пользователя
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!usersDB[username] || usersDB[username] !== password) {
        return res.status(401).json({ success: false, message: "Неверный логин или пароль" });
    }

    // Определяем роль (главный admin или из словаря ролей)
    const role = (username === 'admin' || userRoles[username] === 'admin') ? 'admin' : 'user';

    res.json({ 
        success: true, 
        role: role,
        message: "Успешный вход" 
    });
});

// 2. Получение списка всех пользователей (для админ-панели)
app.get('/api/users', (req, res) => {
    const userList = Object.keys(usersDB)
        .filter(u => u !== 'admin') // Главного админа можно не показывать в списке управления
        .map(u => ({
            username: u,
            role: userRoles[u] || 'user'
        }));
    res.json({ success: true, users: userList });
});

// 3. Добавление нового пользователя
app.post('/api/users/add', (req, res) => {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword) {
        return res.status(400).json({ success: false, message: "Заполните логин и пароль" });
    }

    if (usersDB[newUsername]) {
        return res.status(400).json({ success: false, message: "Такой пользователь уже существует" });
    }

    usersDB[newUsername] = newPassword;
    userRoles[newUsername] = 'user'; // По умолчанию новый юзер — обычный

    res.json({ success: true, message: "Пользователь успешно добавлен" });
});

// 4. Удаление пользователя
app.post('/api/users/delete', (req, res) => {
    const { usernameToDelete } = req.body;

    if (!usernameToDelete || usernameToDelete === 'admin') {
        return res.status(400).json({ success: false, message: "Нельзя удалить этого пользователя" });
    }

    if (usersDB[usernameToDelete]) {
        delete usersDB[usernameToDelete];
        delete userRoles[usernameToDelete];
        return res.json({ success: true, message: "Пользователь удален" });
    }

    res.status(404).json({ success: false, message: "Пользователь не найден" });
});

// 5. Изменение роли пользователя (выдача / снятие админки)
app.post('/api/users/role', (req, res) => {
    const { usernameToUpdate, newRole } = req.body;

    if (!usernameToUpdate || usernameToUpdate === 'admin') {
        return res.status(400).json({ success: false, message: "Нельзя изменить роль этого пользователя" });
    }

    if (!['user', 'admin'].includes(newRole)) {
        return res.status(400).json({ success: false, message: "Некорректная роль" });
    }

    if (usersDB[usernameToUpdate]) {
        userRoles[usernameToUpdate] = newRole;
        return res.json({ success: true, message: `Роль изменена на ${newRole}` });
    }

    res.status(404).json({ success: false, message: "Пользователь не найден" });
});

// 6. Проверка активности сессии (Heartbeat / Верификация для мода)
app.post('/api/verify', (req, res) => {
    const { username } = req.body;
    
    if (username && usersDB[username]) {
        return res.json({ success: true, active: true });
    }
    
    // Если пользователя удалили или заблокировали
    res.json({ success: true, active: false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Эндпоинт для защищенной загрузки скрипта мода
app.post('/api/get-mod', (req, res) => {
    const { username } = req.body;

    // Проверяем, существует ли пользователь и активен ли он
    if (!username || !usersDB[username]) {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Здесь находится сам защищенный код вашего мода (injected.js), 
    // который теперь хранится ТОЛЬКО на сервере и скрыт от посторонних глаз:
    const protectedModCode = `
        console.log("Mod successfully loaded from secure server for user: ${username}");
        
        // Вставьте сюда весь ваш реальный код из injected.js:
        // Например, логику работы чита, хуки, функции и т.д.
        
        (function() {
            // Ваш код мода работает здесь
        })();
    `;

    res.json({ 
        success: true, 
        script: protectedModCode 
    });
});
