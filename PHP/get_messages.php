<?php

$file = 'chat_messages.json'; // Файл для хранения сообщений

// Читаем сообщения из файла
if (file_exists($file)) {
    $messages = json_decode(file_get_contents($file), true);
    // Отправляем сообщения в формате JSON
    header('Content-Type: application/json');
    echo json_encode($messages);
} else {
    http_response_code(404); // Not Found
    echo "Сообщения не найдены.";
}

?>