const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

exports.handler = async function(event, context) {
    const adapter = new FileSync('db.json'); // Файл базы данных (внутри папки functions)
    const db = low(adapter);

    // Инициализация базы данных, если ее нет (только при первом запуске)
    db.defaults({ users: [], marketItems: [] }).write();

    const { itemId, buyerUsername } = JSON.parse(event.body); // Получаем данные из тела запроса

    if (!itemId || !buyerUsername) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Необходимо указать ID товара и имя покупателя.' }) };
    }

    const item = db.get('marketItems').find({ id: parseInt(itemId) }).value();
    if (!item) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Товар не найден.' }) };
    }

    const buyer = db.get('users').find({ username: buyerUsername }).value();
    if (!buyer) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Покупатель не найден.' }) };
    }

    const seller = db.get('users').find({ id: item.sellerId }).value();
    if (!seller) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Продавец не найден.' }) };
    }

    if (buyer.bits < item.price) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Недостаточно битов для покупки.' }) };
    }
    if (seller.username === buyerUsername) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Вы не можете купить собственный товар.' }) };
    }


    // Выполняем транзакцию
    db.get('users')
        .find({ username: buyerUsername })
        .assign({ bits: buyer.bits - item.price })
        .write();

    db.get('users')
        .find({ id: item.sellerId })
        .assign({ bits: seller.bits + item.price })
        .write();

    // Удаляем товар с рынка
    db.get('marketItems')
        .remove({ id: parseInt(itemId) })
        .write();

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Покупка совершена успешно.', newBalance: buyer.bits - item.price })
    };
};