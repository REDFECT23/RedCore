// netlify/functions/update-profile.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

// Ваши настройки Firebase
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
        const { username, newUsername } = JSON.parse(event.body);

        if (!username || !newUsername) {
            return { statusCode: 400, headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              }, body: JSON.stringify({ error: 'Необходимо указать текущее и новое имя пользователя.' }) };
        }
        const usersCol = collection(db, "users");
        const q = query(usersCol, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { statusCode: 404, headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              }, body: JSON.stringify({ error: 'Пользователь не найден.' }) };
        }
        const userDocRef = doc(db, "users", querySnapshot.docs[0].id);

        // Проверка на дубликат нового имени
        const q2 = query(usersCol, where("username", "==", newUsername));
        const duplicateSnapshot = await getDocs(q2);

        if (!duplicateSnapshot.empty && duplicateSnapshot.docs[0].id != querySnapshot.docs[0].id) {
               return { statusCode: 400, headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              }, body: JSON.stringify({ error: 'Это имя пользователя уже занято.' }) };
        }

        await updateDoc(userDocRef, {
            username: newUsername
        });

        return {
            statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              },
            body: JSON.stringify({ success: true, message: 'Имя пользователя успешно изменено.' }),
        };
    } catch (error) {
        console.error("Ошибка при обновлении профиля:", error);
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