document.addEventListener("DOMContentLoaded", () => {
    updatePlayerInfo();
    loadOfficialItems();
    loadMarketItems();
});

// Обновление информации игрока
function updatePlayerInfo() {
    let playerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0 };
    document.getElementById("bits").textContent = playerData.bits;
    document.getElementById("level").textContent = playerData.level;
    document.getElementById("xp").textContent = playerData.xp;
}

// Загрузка официальных товаров
function loadOfficialItems() {
    let officialItems = [
        { id: 1, name: "Фон (Киберпанк)", price: 50, image: "img/cyberpunk-bg.jpg", category: "backgrounds" },
        { id: 2, name: "Фон (Галактика)", price: 75, image: "img/galaxy-bg.jpg", category: "backgrounds" }
    ];
    
    let container = document.getElementById("official-items");
    container.innerHTML = "";

    officialItems.forEach(item => {
        let div = document.createElement("div");
        div.classList.add("market-item");
        div.innerHTML = `
            <img src="${item.image}" class="item-image">
            <p><strong>${item.name}</strong></p>
            <p><strong>${item.price} битов</strong></p>
            <button onclick="buyOfficialItem(${item.id})">Купить</button>
        `;
        container.appendChild(div);
    });
}

// Загрузка товаров игроков
function loadMarketItems(category = "all") {
    let items = JSON.parse(localStorage.getItem("marketItems")) || [];
    let marketList = document.getElementById("market-list");
    marketList.innerHTML = "";

    items.filter(item => category === "all" || item.category === category).forEach(item => {
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("market-item");
        itemDiv.innerHTML = `
            <img src="${item.image}" class="item-image">
            <p><strong>${item.name}</strong></p>
            <p>${item.description}</p>
            <p><strong>${item.price} битов</strong></p>
            <button onclick="buyItem(${item.id})">Купить</button>
        `;
        marketList.appendChild(itemDiv);
    });
}

// Добавление товара игроком
document.getElementById("add-item-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let name = document.getElementById("item-name").value;
    let description = document.getElementById("item-description").value;
    let price = parseInt(document.getElementById("item-price").value);
    let category = document.getElementById("item-category").value;
    let imageInput = document.getElementById("item-image").files[0];

    if (!imageInput) return alert("Выберите изображение!");

    let reader = new FileReader();
    reader.onload = function(event) {
        let imageData = event.target.result;

        let items = JSON.parse(localStorage.getItem("marketItems")) || [];
        let newItem = { id: items.length + 1, name, description, price, image: imageData, category };
        items.push(newItem);
        localStorage.setItem("marketItems", JSON.stringify(items));

        loadMarketItems();
        e.target.reset();
    };
    reader.readAsDataURL(imageInput);
});

// Фильтр по категориям
document.getElementById("category-filter").addEventListener("change", (e) => {
    loadMarketItems(e.target.value);
});

// Покупка товаров игроков
function buyItem(itemId) {
    let items = JSON.parse(localStorage.getItem("marketItems")) || [];
    let playerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0 };

    let itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return alert("Товар не найден");
    
    let item = items[itemIndex];
    if (playerData.bits < item.price) return alert("Недостаточно битов");

    playerData.bits -= item.price;
    playerData.xp += 10;
    if (playerData.xp >= 100) { playerData.level++; playerData.xp = 0; } 

    items.splice(itemIndex, 1);
    localStorage.setItem("playerData", JSON.stringify(playerData));
    localStorage.setItem("marketItems", JSON.stringify(items));

    updatePlayerInfo();
    loadMarketItems();
}

// Покупка официальных товаров
function buyOfficialItem(itemId) {
    let officialItems = [
        { id: 1, name: "Фон (Киберпанк)", price: 50, image: "img/cyberpunk-bg.jpg", category: "backgrounds" },
        { id: 2, name: "Фон (Галактика)", price: 75, image: "img/galaxy-bg.jpg", category: "backgrounds" }
    ];

    let playerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0 };

    let item = officialItems.find(i => i.id === itemId);
    if (!item) return alert("Товар не найден");

    if (playerData.bits < item.price) return alert("Недостаточно битов");

    playerData.bits -= item.price;
    playerData.xp += 20;
    if (playerData.xp >= 100) { playerData.level++; playerData.xp = 0; } 

    playerData.ownedItems = playerData.ownedItems || [];
    playerData.ownedItems.push(item.name);

    localStorage.setItem("playerData", JSON.stringify(playerData));

    updatePlayerInfo();
    alert(`Вы купили: ${item.name}`);
}
document.addEventListener("DOMContentLoaded", () => {
    loadAuctions();
});

// Загрузка аукционов
function loadAuctions() {
    let auctions = JSON.parse(localStorage.getItem("auctions")) || [];
    let auctionList = document.getElementById("auction-list");
    auctionList.innerHTML = "";

    auctions.forEach(auction => {
        let remainingTime = Math.max(0, auction.endTime - Date.now());
        let timeLeft = new Date(remainingTime).toISOString().substr(11, 8);

        let div = document.createElement("div");
        div.classList.add("market-item");
        div.innerHTML = `
            <img src="${auction.image}" class="item-image">
            <p><strong>${auction.name}</strong></p>
            <p>${auction.description}</p>
            <p>Текущая ставка: <strong>${auction.currentBid} битов</strong></p>
            <p>До конца: <strong>${timeLeft}</strong></p>
            <input type="number" id="bid-${auction.id}" placeholder="Твоя ставка">
            <button onclick="placeBid(${auction.id})">Сделать ставку</button>
        `;
        auctionList.appendChild(div);
    });
}

// Выставление товара на аукцион
document.getElementById("auction-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let name = document.getElementById("auction-name").value;
    let description = document.getElementById("auction-description").value;
    let startPrice = parseInt(document.getElementById("auction-start-price").value);
    let imageInput = document.getElementById("auction-image").files[0];

    if (!imageInput) return alert("Выберите изображение!");

    let reader = new FileReader();
    reader.onload = function(event) {
        let imageData = event.target.result;

        let auctions = JSON.parse(localStorage.getItem("auctions")) || [];
        let newAuction = { 
            id: auctions.length + 1, 
            name, 
            description, 
            currentBid: startPrice, 
            highestBidder: null, 
            endTime: Date.now() + 86400000, // 24 часа
            image: imageData 
        };

        auctions.push(newAuction);
        localStorage.setItem("auctions", JSON.stringify(auctions));

        loadAuctions();
        e.target.reset();
    };
    reader.readAsDataURL(imageInput);
});

// Ставка на аукцион
function placeBid(auctionId) {
    let auctions = JSON.parse(localStorage.getItem("auctions")) || [];
    let playerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0 };

    let auction = auctions.find(a => a.id === auctionId);
    if (!auction) return alert("Аукцион не найден");

    let bidInput = document.getElementById(`bid-${auctionId}`);
    let bidAmount = parseInt(bidInput.value);

    if (bidAmount <= auction.currentBid) return alert("Ставка должна быть выше текущей!");
    if (playerData.bits < bidAmount) return alert("Недостаточно битов!");

    auction.currentBid = bidAmount;
    auction.highestBidder = "Ты";

    localStorage.setItem("auctions", JSON.stringify(auctions));
    loadAuctions();
}