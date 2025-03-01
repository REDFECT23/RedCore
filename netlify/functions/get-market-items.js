// netlify/functions/get-market-items.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Ваши настройки Firebase (замените на свои!)
const firebaseConfig = {
    apiKey: "AIzaSyDzE1-kq47UxnJ2F9Ss2pLBGQP-db8KQ_8",
    authDomain: "redcore-66bbe.firebaseapp.com",
    projectId: "redcore-66bbe",
    storageBucket: "redcore-66bbe.firebasestorage.app",
    messagingSenderId: "555590821941",
    appId: "1:555590821941:web:163353b152a1638cd7297c"
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