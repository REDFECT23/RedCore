<?php
$username = $_POST['username'];
$message = $_POST['message'];

// Валидация данных (проверка на пустые сообщения и т.д.)
if (empty($username) || empty($message)) {
  http_response_code(400); // Bad Request
  echo "Имя пользователя и сообщение не могут быть пустыми.";
  exit;
}


$file = 'chat_messages.json'; // Файл для хранения сообщений

// Читаем существующие сообщения
$messages = [];
if (file_exists($file)) {
    $messages = json_decode(file_get_contents($file), true);
}

// Добавляем новое сообщение
$messages[] = ['username' => $username, 'message' => $message, 'timestamp' => date('Y-m-d H:i:s')];

// Сохраняем сообщения в файл
file_put_contents($file, json_encode($messages));

http_response_code(200); // OK
echo "Сообщение отправлено!";

?>
