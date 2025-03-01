const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

exports.handler = async function(event, context) {
    const adapter = new FileSync('db.json');
    const db = low(adapter);

    // Инициализация базы данных, если ее нет
    db.defaults({ users: [], marketItems: [] }).write();

    const username = event.queryStringParameters.username; // Получаем имя пользователя из query parameters

    if (!username) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Необходимо указать имя пользователя.' }) };
    }

    const user = db.get('users').find({ username: username }).value();

    if (!user) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Пользователь не найден.' }) };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(user), // Возвращаем данные пользователя в JSON формате
    };
};