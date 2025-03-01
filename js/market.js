document.addEventListener("DOMContentLoaded", () => {
    setupPlayer();
    updatePlayerInfo();
    loadOfficialItems();
    loadMarketItems();
    loadAuctions();
    loadCart();
    updateCartItemCount();
    loadInventory();
    setupModalButtons();
    startAuctionTimers(); // Запускаем таймеры аукционов при загрузке
    startSaleTimers(); // Запускаем таймеры распродаж
});

let currentPlayerUsername = '';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let bargainRequests = JSON.parse(localStorage.getItem('bargainRequests')) || {}; // Для хранения запросов на торг

function setupPlayer() {
    let playerData = JSON.parse(localStorage.getItem("playerData")) || {};
    if (!playerData.username) {
        requestUsername();
    } else {
        currentPlayerUsername = playerData.username;
        document.getElementById("username").textContent = currentPlayerUsername;
    }
}

function requestUsername() {
    const defaultUsername = "Игрок";
    let username = prompt("Введите ваше имя:", defaultUsername) || defaultUsername;
    currentPlayerUsername = username.trim() || defaultUsername;
    localStorage.setItem("playerData", JSON.stringify({ ...JSON.parse(localStorage.getItem("playerData") || '{}'), username: currentPlayerUsername, bits: 100, level: 1, xp: 0, inventory: [] }));
    document.getElementById("username").textContent = currentPlayerUsername;
    updatePlayerInfo();
}

document.getElementById("change-username").addEventListener("click", requestUsername);

function updatePlayerInfo() {
    let playerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0, username: currentPlayerUsername, inventory: [] };
    document.getElementById("username").textContent = playerData.username || currentPlayerUsername;
    document.getElementById("bits").textContent = playerData.bits;
    document.getElementById("level").textContent = playerData.level;
    document.getElementById("xp").textContent = playerData.xp;
}

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
            <div class="item-image-container">
                <img src="${item.image}" class="item-image" alt="${item.name}">
            </div>
            <strong>${item.name}</strong>
            <p><strong class="current-price">${item.price} битов</strong></p>
            <button onclick="addToCartOfficial(${item.id})">В корзину</button>
        `;
        container.appendChild(div);
        setupImageRotation(div.querySelector('.item-image-container'));
    });
}

function loadMarketItems(category = "all") {
    let items = JSON.parse(localStorage.getItem("marketItems")) || [];
    let marketList = document.getElementById("market-list");
    marketList.innerHTML = "";

    // Проверяем и обрабатываем запросы на торг (упрощенно, для примера)
    let currentBargainRequests = JSON.parse(localStorage.getItem('bargainRequests')) || {};
    Object.keys(currentBargainRequests).forEach(itemId => {
        let item = items.find(i => i.id === parseInt(itemId));
        if (item && currentBargainRequests[itemId].status === 'approved') {
            item.price = currentBargainRequests[itemId].finalPrice; // Обновляем цену на цену торга
        }
    });


    items.filter(item => category === "all" || item.category === category).forEach(item => {
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("market-item");

        let priceDisplay = `<p>Цена: <strong class="current-price">${item.price} битов</strong></p>`;
        if (item.salePrice && Date.now() < new Date(item.saleEndTime).getTime()) {
            priceDisplay = `<p><span class="sale-price">${item.price} битов</span> <strong class="current-price">${item.salePrice} битов</strong> <span class="sale-timer" id="sale-timer-${item.id}"></span></p>`;
        } else {
            item.salePrice = null; // Убираем цену распродажи, если время вышло или она не задана
            item.saleEndTime = null;
        }


        itemDiv.innerHTML = `
            <div class="item-image-container">
                <img src="${item.image}" class="item-image" alt="${item.name}">
            </div>
            <strong>${item.name}</strong>
            <p>${item.description}</p>
            ${priceDisplay}
            <p class="seller-info">Продавец: ${item.sellerUsername}</p>
            <button onclick="addToCart(${item.id})">В корзину</button>
            <button class="bargain-button" onclick="openBargainModal(${item.id}, '${item.name}')">Торговаться</button>
        `;
        marketList.appendChild(itemDiv);
        setupImageRotation(itemDiv.querySelector('.item-image-container'));
    });
    startSaleTimers(); // Запускаем таймеры распродаж после загрузки товаров
}


function loadAuctions() {
    let auctions = JSON.parse(localStorage.getItem("auctions")) || [];
    let auctionList = document.getElementById("auction-list");
    auctionList.innerHTML = "";

    auctions.forEach(auction => {
        let bidIncrement = auction.bidIncrement || 1;

        let div = document.createElement("div");
        div.classList.add("market-item");
        div.innerHTML = `
            <div class="item-image-container">
                <img src="${auction.image}" class="item-image" alt="${auction.name}">
            </div>
            <strong>${auction.name}</strong>
            <p>${auction.description}</p>
            <p>Текущая ставка: <strong>${auction.currentBid} битов</strong></p>
            <p>Мин. шаг: <strong>${bidIncrement} битов</strong></p>
            <p>До конца: <strong id="auction-timer-${auction.id}"></strong></p>
            <input type="number" id="bid-${auction.id}" placeholder="Твоя ставка (мин. ${auction.currentBid + bidIncrement})">
            <button onclick="placeBid(${auction.id}, ${bidIncrement})">Сделать ставку</button>
        `;
        auctionList.appendChild(div);
        setupImageRotation(div.querySelector('.item-image-container'));
    });
    startAuctionTimers(); // Запускаем таймеры аукционов после загрузки
}


function setupImageRotation(imageContainer) {
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let rotationX = 0;
    let rotationY = 0;
    const image = imageContainer.querySelector('.item-image');

    const resetRotation = () => {
        image.style.transform = `rotateX(0deg) rotateY(0deg)`;
        rotationX = 0;
        rotationY = 0;
    };

    imageContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousX = e.clientX;
        previousY = e.clientY;
        imageContainer.style.cursor = 'grabbing';
        e.preventDefault(); // Предотвращаем стандартное поведение перетаскивания
    });

    imageContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - previousX;
        const deltaY = e.clientY - previousY;

        rotationY += deltaX * 0.2;
        rotationX -= deltaY * 0.2;

        // ---------->  НАДЕЖНОЕ ОГРАНИЧЕНИЕ: от -80 до 80 градусов для rotationX <----------
        if (rotationX > 80) rotationX = 80;
        if (rotationX < -80) rotationX = -80;

        image.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

        previousX = e.clientX;
        previousY = e.clientY;
        e.preventDefault(); // Предотвращаем выделение текста во время перетаскивания
    });

    imageContainer.addEventListener('mouseup', () => {
        isDragging = false;
        imageContainer.style.cursor = 'grab';
    });

    imageContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        imageContainer.style.cursor = 'grab';
        resetRotation();
    });

    // Для сенсорных устройств
    imageContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousX = e.touches[0].clientX;
        previousY = e.touches[0].clientY;
        e.preventDefault(); // Предотвращаем стандартное поведение касания
    });

    imageContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const deltaX = e.touches[0].clientX - previousX;
        const deltaY = e.touches[0].clientY - previousY;

        rotationY += deltaX * 0.4;
        rotationX -= deltaY * 0.4;

        // ---------->  НАДЕЖНОЕ ОГРАНИЧЕНИЕ: от -80 до 80 градусов для rotationX (касание) <----------
        if (rotationX > 80) rotationX = 80;
        if (rotationX < -80) rotationX = -80;


        image.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

        previousX = e.touches[0].clientX;
        previousY = e.clientY;
        e.preventDefault(); // Предотвращаем прокрутку страницы во время перетаскивания касанием
    });

    imageContainer.addEventListener('touchend', () => {
        isDragging = false;
        resetRotation();
    });

    imageContainer.addEventListener('touchcancel', () => { // Добавляем обработчик touchcancel
        isDragging = false;
        resetRotation();
    });
}


document.getElementById("add-item-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let name = document.getElementById("item-name").value;
    let description = document.getElementById("item-description").value;
    let price = parseInt(document.getElementById("item-price").value);
    let salePrice = document.getElementById("sale-price").value ? parseInt(document.getElementById("sale-price").value) : null;
    let saleDuration = document.getElementById("sale-duration").value ? parseInt(document.getElementById("sale-duration").value) : null;
    let category = document.getElementById("item-category").value;
    let imageInput = document.getElementById("item-image").files[0];
    let saleEndTime = null;

    if (!imageInput) return alert("Выберите изображение!");
    if (salePrice && isNaN(salePrice)) return alert("Цена распродажи должна быть числом.");
    if (saleDuration && isNaN(saleDuration)) return alert("Длительность распродажи должна быть числом.");
    if (salePrice && salePrice >= price) return alert("Цена распродажи должна быть ниже обычной цены.");
    if (saleDuration && saleDuration < 1) return alert("Длительность распродажи должна быть не менее 1 часа.");

    if (saleDuration) {
        saleEndTime = new Date(Date.now() + saleDuration * 3600000).toISOString(); // Время окончания распродажи
    }


    let reader = new FileReader();
    reader.onload = function(event) {
        let imageData = event.target.result;

        let items = JSON.parse(localStorage.getItem("marketItems")) || [];
        let newItem = {
            id: Date.now(),
            name,
            description,
            price,
            salePrice: salePrice,
            saleEndTime: saleEndTime,
            image: imageData,
            category,
            sellerUsername: currentPlayerUsername
        };
        items.push(newItem);
        localStorage.setItem("marketItems", JSON.stringify(items));

        loadMarketItems();
        e.target.reset();
        closeModal('add-item-modal');
        alert("Товар успешно выставлен на продажу!");
    };
    reader.readAsDataURL(imageInput);
});


document.getElementById("category-filter").addEventListener("change", (e) => {
    loadMarketItems(e.target.value);
});


function addToCart(itemId) {
    let items = JSON.parse(localStorage.getItem("marketItems")) || [];
    let itemToAdd = items.find(item => item.id === itemId);
    if (itemToAdd) {
        const priceToUse = itemToAdd.salePrice !== null && Date.now() < new Date(itemToAdd.saleEndTime).getTime() ? itemToAdd.salePrice : itemToAdd.price;
        cart.push({ ...itemToAdd, type: 'player', currentPrice: priceToUse }); // Сохраняем текущую цену в корзине
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartItemCount();
        alert(`"${itemToAdd.name}" добавлен в корзину!`);
    }
}

function addToCartOfficial(itemId) {
    let officialItems = [
        { id: 1, name: "Фон (Киберпанк)", price: 50, image: "img/cyberpunk-bg.jpg", category: "backgrounds" },
        { id: 2, name: "Фон (Галактика)", price: 75, image: "img/galaxy-bg.jpg", category: "backgrounds" }
    ];
    let itemToAdd = officialItems.find(item => item.id === itemId);
    if (itemToAdd) {
        cart.push({ ...itemToAdd, type: 'official', currentPrice: itemToAdd.price }); // Сохраняем текущую цену
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartItemCount();
        alert(`"${itemToAdd.name}" добавлен в корзину!`);
    }
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItemsContainer = document.getElementById('cart-items');
    let cartTotalElement = document.getElementById('cart-total-price');
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('market-item');
        itemDiv.innerHTML = `
            <div class="item-image-container">
                <img src="${item.image}" class="item-image" alt="${item.name}">
            </div>
            <div>
                <strong>${item.name}</strong>
                <p>Цена: ${item.currentPrice} битов</p>
            </div>
            <button onclick="removeFromCart(${index})">Удалить</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
        setupImageRotation(itemDiv.querySelector('.item-image-container'));
        total += item.currentPrice;
    });
    cartTotalElement.textContent = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartItemCount();
}

function updateCartItemCount() {
    document.getElementById('cart-item-count').textContent = cart.length;
}

document.getElementById('checkout-button').addEventListener('click', checkout);

function checkout() {
    let playerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0, username: currentPlayerUsername, inventory: [] };
    let cartTotal = cart.reduce((sum, item) => sum + item.currentPrice, 0);

    if (playerData.bits < cartTotal) {
        return alert("Недостаточно битов для оформления заказа!");
    }

    playerData.bits -= cartTotal;
    playerData.xp += Math.floor(cartTotal / 10);

    if (playerData.xp >= 100) {
        playerData.level++;
        playerData.xp -= 100;
    }

    cart.forEach(item => {
        playerData.inventory.push({ itemId: item.id, itemName: item.name, itemImage: item.image, itemType: item.type });
        if (item.type === 'player') {
            removePlayerItemAfterPurchase(item.id);
        }
    });

    localStorage.setItem("playerData", JSON.stringify(playerData));
    localStorage.removeItem('cart');
    cart = [];
    updateCartItemCount();
    loadCart();
    updatePlayerInfo();
    loadInventory();
    closeModal('cart-modal');
    alert("Заказ оформлен! Товары добавлены в инвентарь.");
}

function removePlayerItemAfterPurchase(itemId) {
    let items = JSON.parse(localStorage.getItem("marketItems")) || [];
    let updatedItems = items.filter(item => item.id !== itemId);
    localStorage.setItem("marketItems", JSON.stringify(updatedItems));
    loadMarketItems();
}


function loadInventory() {
    let playerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0, username: currentPlayerUsername, inventory: [] };
    let inventoryItemsContainer = document.getElementById('inventory-items');
    inventoryItemsContainer.innerHTML = '';

    playerData.inventory.forEach(item => {
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('market-item');
        itemDiv.innerHTML = `
            <div class="item-image-container">
                <img src="${item.itemImage}" class="item-image" alt="${item.itemName}">
            </div>
            <strong>${item.itemName}</strong>
            <p>Тип: ${item.itemType === 'official' ? 'Официальный' : 'Игрок'}</p>
            <p>ID: ${item.itemId}</p>
        `;
        inventoryItemsContainer.appendChild(itemDiv);
        setupImageRotation(itemDiv.querySelector('.item-image-container'));
    });
}


document.getElementById("auction-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let name = document.getElementById("auction-name").value;
    let description = document.getElementById("auction-description").value;
    let startPrice = parseInt(document.getElementById("auction-start-price").value);
    let durationHours = parseInt(document.getElementById("auction-duration").value);
    let bidIncrement = parseInt(document.getElementById("auction-bid-increment").value);
    let imageInput = document.getElementById("auction-image").files[0];

    if (!imageInput) return alert("Выберите изображение!");
    if (isNaN(durationHours) || durationHours < 1 || durationHours > 24) return alert("Длительность аукциона должна быть от 1 до 24 часов.");
    if (isNaN(bidIncrement) || bidIncrement < 1) return alert("Шаг ставки должен быть не менее 1.");


    let reader = new FileReader();
    reader.onload = function(event) {
        let imageData = event.target.result;
        let endTime = Date.now() + durationHours * 3600000;

        let auctions = JSON.parse(localStorage.getItem("auctions")) || [];
        let newAuction = {
            id: Date.now(),
            name,
            description,
            currentBid: startPrice,
            highestBidder: null,
            endTime: endTime,
            image: imageData,
            sellerUsername: currentPlayerUsername,
            bidIncrement: bidIncrement
        };

        auctions.push(newAuction);
        localStorage.setItem("auctions", JSON.stringify(auctions));

        loadAuctions();
        e.target.reset();
        closeModal('auction-modal');
        alert("Аукцион успешно выставлен!");
    };
    reader.readAsDataURL(imageInput);
});


function placeBid(auctionId, bidIncrement) {
    let auctions = JSON.parse(localStorage.getItem("auctions")) || [];
    let playerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0, username: currentPlayerUsername };

    let auction = auctions.find(a => a.id === auctionId);
    if (!auction) return alert("Аукцион не найден");

    let bidInput = document.getElementById(`bid-${auctionId}`);
    let bidAmount = parseInt(bidInput.value);
    let minBid = auction.currentBid + bidIncrement;


    if (isNaN(bidAmount) || bidAmount < minBid) return alert(`Ставка должна быть не менее ${minBid} битов!`);
    if (playerData.bits < bidAmount) return alert("Недостаточно битов!");
    if (auction.highestBidder === currentPlayerUsername) return alert("Вы уже лидирующий участник!");

    if (auction.highestBidder && auction.highestBidder !== currentPlayerUsername) {
        returnBitsToPreviousBidder(auction.highestBidder, auction.currentBid);
    }


    auction.currentBid = bidAmount;
    auction.highestBidder = currentPlayerUsername;
    auction.lastBidTime = Date.now();

    localStorage.setItem("auctions", JSON.stringify(auctions));
    loadAuctions();
    updatePlayerInfo();
    bidInput.value = '';
    alert("Ставка сделана!");
}


function returnBitsToPreviousBidder(previousBidderUsername, bidAmount) {
    if (!previousBidderUsername) return;

    let bidderPlayerData = JSON.parse(localStorage.getItem("playerData")) || { bits: 100, level: 1, xp: 0, username: currentPlayerUsername };

    let previousBidderData = JSON.parse(localStorage.getItem("playerData")) || {};

    if (previousBidderData.username === previousBidderUsername) {
        previousBidderData.bits = (previousBidderData.bits || 0) + bidAmount;
        localStorage.setItem("playerData", JSON.stringify(previousBidderData));
    }
}


function setupModalButtons() {
    document.getElementById('open-inventory').onclick = () => openModal('inventory-modal');
    document.getElementById('close-inventory').onclick = () => closeModal('inventory-modal');
    document.getElementById('add-item-button').onclick = () => openModal('add-item-modal');
    document.getElementById('close-item-form').onclick = () => closeModal('add-item-modal');
    document.getElementById('create-auction-button').onclick = () => openModal('auction-modal');
    document.getElementById('close-auction-form').onclick = () => closeModal('auction-modal');
    document.getElementById('open-cart-button').onclick = () => openModal('cart-modal');
    document.getElementById('close-cart').onclick = () => closeModal('cart-modal');
    document.getElementById('close-bargain-form').onclick = () => closeModal('bargain-modal'); // Закрытие окна торга
    // Обработчик для кнопки "Торговаться" будет добавлен динамически при загрузке товаров
    document.getElementById('send-bargain-button').onclick = sendBargainOffer; // Обработчик отправки предложения торга

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    }
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// --- Торг ---
let currentBargainItemId = null; // Храним ID товара для торга

function openBargainModal(itemId, itemName) {
    currentBargainItemId = itemId;
    document.getElementById('bargain-item-name').textContent = `Торг за "${itemName}"`;
    openModal('bargain-modal');
}

function sendBargainOffer() {
    const discount = parseInt(document.getElementById('bargain-discount').value);
    if (isNaN(discount) || discount < 0 || discount > 99) {
        return alert("Пожалуйста, укажите корректный процент скидки от 0 до 99.");
    }

    let items = JSON.parse(localStorage.getItem("marketItems")) || [];
    let item = items.find(i => i.id === currentBargainItemId);
    if (!item) {
        return alert("Товар не найден.");
    }

    const offeredPrice = Math.ceil(item.price * (1 - discount / 100)); // Цена с учетом скидки, округляем вверх

    bargainRequests = JSON.parse(localStorage.getItem('bargainRequests')) || {};
    bargainRequests[currentBargainItemId] = {
        itemId: currentBargainItemId,
        buyerUsername: currentPlayerUsername,
        discount: discount,
        offeredPrice: offeredPrice,
        originalPrice: item.price,
        sellerUsername: item.sellerUsername,
        status: 'pending' // Статус запроса на торг
    };
    localStorage.setItem('bargainRequests', JSON.stringify(bargainRequests));

    closeModal('bargain-modal');
    alert(`Предложение торга на скидку ${discount}% отправлено продавцу!`);
    console.log("Запрос на торг:", bargainRequests[currentBargainItemId]); // Для отслеживания запроса (в реальном приложении - уведомление продавцу)
    // В реальном приложении здесь нужно отправить уведомление продавцу (например, через сервер)
}

// --- Распродажи - Таймеры ---
function startSaleTimers() {
    let saleTimers = document.querySelectorAll('.sale-timer');
    saleTimers.forEach(timerElement => {
        const itemId = parseInt(timerElement.id.split('-')[2]);
        let items = JSON.parse(localStorage.getItem("marketItems")) || [];
        let item = items.find(i => i.id === itemId);
        if (item && item.saleEndTime) {
            const endTime = new Date(item.saleEndTime).getTime();
            updateSaleTimer(timerElement, endTime, itemId);
        }
    });
}

function updateSaleTimer(timerElement, endTime, itemId) {
    setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, endTime - now);
        if (timeLeft <= 0) {
            timerElement.textContent = "Распродажа закончилась";
            // Можно обновить цену товара обратно к обычной, если нужно
            let items = JSON.parse(localStorage.getItem("marketItems")) || [];
            let itemIndex = items.findIndex(i => i.id === itemId);
            if (itemIndex !== -1) {
                items[itemIndex].salePrice = null; // Убираем цену распродажи
                items[itemIndex].saleEndTime = null; // Убираем время окончания
                localStorage.setItem("marketItems", JSON.stringify(items));
                loadMarketItems(); // Перезагружаем список товаров, чтобы убрать распродажу
            }
        } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            timerElement.textContent = `Распродажа закончится через: ${days}д ${hours}ч ${minutes}м ${seconds}с`;
        }
    }, 1000);
}

// --- Аукционы - Динамический таймер ---
function startAuctionTimers() {
    let auctionTimers = document.querySelectorAll('[id^="auction-timer-"]');
    auctionTimers.forEach(timerElement => {
        const auctionId = parseInt(timerElement.id.split('-')[2]);
        updateAuctionTimer(timerElement, auctionId);
    });
}

function updateAuctionTimer(timerElement, auctionId) {
    setInterval(() => {
        let auctions = JSON.parse(localStorage.getItem("auctions")) || [];
        let auction = auctions.find(a => a.id === auctionId);
        if (!auction) return;

        const remainingTime = Math.max(0, auction.endTime - Date.now());
        if (remainingTime <= 0) {
            timerElement.textContent = "Аукцион завершен";
            // Здесь можно добавить логику завершения аукциона, например, определение победителя
        } else {
            const timeLeft = new Date(remainingTime);
            const hours = timeLeft.getUTCHours().toString().padStart(2, '0');
            const minutes = timeLeft.getUTCMinutes().toString().padStart(2, '0');
            const seconds = timeLeft.getUTCSeconds().toString().padStart(2, '0');
            timerElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }, 1000);
}