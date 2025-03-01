const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

exports.handler = async function(event, context) {
    const adapter = new FileSync('db.json');
    const db = low(adapter);

    // Инициализация базы данных, если ее нет
    db.defaults({ users: [], marketItems: [] }).write();

    const { username, newUsername } = JSON.parse(event.body); // Получаем текущее и новое имя из тела запроса

    if (!username || !newUsername) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Необходимо указать текущее и новое имя пользователя.' }) };
    }

    const user = db.get('users').find({ username: username }).value();

    if (!user) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Пользователь не найден.' }) };
    }

    // Проверяем, не занято ли новое имя другим пользователем (опционально, если нужно уникальное имя)
    const existingUserWithNewName = db.get('users').find({ username: newUsername }).value();
    if (existingUserWithNewName && existingUserWithNewName.username !== username) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Это имя пользователя уже занято.' }) };
    }


    // Обновляем имя пользователя в базе данных
    db.get('users')
        .find({ username: username })
        .assign({ username: newUsername })
        .write();

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Имя пользователя успешно изменено.' })
    };
};