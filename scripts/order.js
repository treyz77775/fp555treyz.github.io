// Замените ваш order.js на этот код

// Функция для получения товаров из корзины
function getCartItems() {
    const itemsJSON = localStorage.getItem("orderedItems");
    return itemsJSON ? JSON.parse(itemsJSON) : [];
}

// Функция для отображения товаров в корзине
function displayOrderItems() {
    const cartItems = getCartItems();
    const container = document.getElementById('order-items-container');
    const subtotalElement = document.getElementById('order-subtotal');
    const totalElement = document.getElementById('order-total');
    
    container.innerHTML = '';
    
    if (cartItems.length === 0) {
        container.innerHTML = '<p class="empty-cart-message">Ваша корзина пуста</p>';
        subtotalElement.textContent = '0 Р';
        totalElement.textContent = '0 Р';
        return;
    }
    
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * (item.count || item.amount || 1);
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="product">
                <img src="${item.image || item.href || 'default-product.jpg'}" alt="${item.name}">
                <p class="product-name">${item.name}</p>
            </div>
            <p class="product-quantity">${item.count || item.amount || 1}</p>
            <p class="product-price">${item.price} Р</p>
            <p class="product-total">${itemTotal} Р</p>
        `;
        
        container.appendChild(itemElement);
    });
    
    // Обновляем итоговые суммы
    subtotalElement.textContent = `${subtotal.toFixed(2)} Р`;
    totalElement.textContent = `${subtotal.toFixed(2)} Р`; // Если доставка бесплатная
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    displayOrderItems();
    
    // Остальной код инициализации PayPal...
});

// Функция для создания purchase_units для PayPal
function createPurchaseUnits() {
    const cartItems = getCartItems();
    
    if (cartItems.length === 0) {
        alert("Корзина пуста!");
        return null;
    }
    
    let items = cartItems.map(item => ({
        name: item.name.substring(0, 127), // Ограничение PayPal
        unit_amount: {
            currency_code: "RUB",
            value: item.price.toFixed(2)
        },
        quantity: (item.count || item.amount || 1).toString(),
        sku: item.id || '1'
    }));
    
    let subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.price * (item.count || item.amount || 1));
    }, 0);
    
    return [{
        amount: {
            currency_code: "RUB",
            value: subtotal.toFixed(2),
            breakdown: {
                item_total: {
                    currency_code: "RUB",
                    value: subtotal.toFixed(2)
                }
            }
        },
        items: items
    }];
}