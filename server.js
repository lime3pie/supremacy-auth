const express = require('express');
const cors = require('cors'); // <--- Добавили
const app = express();

app.use(cors()); // <--- Разрешили запросы из расширений и браузера
app.use(express.json());

const usersDB = {
    "user1": "pass123",
    "friend_ivan": "qwerty777"
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (usersDB[username] && usersDB[username] === password) {
        console.log(`✅ Успешный вход: ${username}`);
        return res.json({ 
            success: true, 
            message: "Авторизация успешна!" 
        });
    }

    console.log(`❌ Неудачная попытка входа для: ${username}`);
    return res.status(401).json({ 
        success: false, 
        message: "Неверный логин или пароль" 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});