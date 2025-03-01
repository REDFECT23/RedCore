// netlify/functions/get-market-items.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
        const productsCol = collection(db, "marketItems"); //  Используем "marketItems", как в оригинале
        const productSnapshot = await getDocs(productsCol);
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
              },
            body: JSON.stringify(productList),
        };
    } catch (error) {
        console.error("Ошибка при получении товаров:", error);
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