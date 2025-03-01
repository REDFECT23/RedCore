// netlify/functions/get-profile.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Ваши настройки Firebase (замените на свои!)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
// Инициализируем Firebase ТОЛЬКО ЕСЛИ он ещё не инициализирован.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handler(event, context) {
    try {
        const username = event.queryStringParameters.username; // Получаем имя пользователя из query parameters

        if (!username) {
            return { statusCode: 400,
              headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              }, body: JSON.stringify({ error: 'Необходимо указать имя пользователя.' }) };
        }

        const usersCol = collection(db, "users"); //  "users" - название коллекции
        const q = query(usersCol, where("username", "==", username)); //  Ищем пользователя по username
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { statusCode: 404,  headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              },body: JSON.stringify({ error: 'Пользователь не найден.' }) };
        }

        const user = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }; //  Берём первого пользователя (должен быть только один)


        return {
            statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              },
            body: JSON.stringify(user),
        };
    } catch (error) {
        console.error("Ошибка при получении профиля:", error);
        return {
            statusCode: 500,
              headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              },
            body: JSON.stringify({ error: "Ошибка сервера" }),
        };
    }
}