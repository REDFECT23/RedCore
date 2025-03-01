const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

exports.handler = async function(event, context) {
    const adapter = new FileSync('db.json');
    const db = low(adapter);

    // Инициализация базы данных, если ее нет
    db.defaults({ users: [], marketItems: [] }).write();

    const marketItems = db.get('marketItems').value(); // Получаем товары из базы данных

    return {
        statusCode: 200,
        body: JSON.stringify(marketItems), // Возвращаем товары в JSON формате
    };
};
