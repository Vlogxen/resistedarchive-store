// Главный файл приложения

// Рендер товаров на странице
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">${product.image}</div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <div class="product-price">${product.price} ${product.currency}</div>
          <button class="btn add-to-cart-btn" data-id="${product.id}">В корзину</button>
        </div>
      </div>
    </div>
  `).join('');

  // Обработчики для кнопок "В корзину"
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = parseInt(e.target.dataset.id);
      const product = products.find(p => p.id === productId);
      if (product) {
        cart.addItem(product);
        
        // Визуальная обратная связь
        e.target.textContent = '✓ Добавлено';
        setTimeout(() => {
          e.target.textContent = 'В корзину';
        }, 1000);
      }
    });
  });

  // Клик по карточке = просмотр товара (для пикселя)
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('add-to-cart-btn')) {
        const productId = parseInt(card.dataset.id);
        const product = products.find(p => p.id === productId);
        if (product) {
          pixelTracking.trackViewContent(product);
        }
      }
    });
  });
}

// Модальные окна
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutForm = document.getElementById('checkoutForm');

// Открыть корзину
cartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  cart.renderCartItems();
  cartModal.classList.add('active');
});

// Закрыть корзину
closeCart.addEventListener('click', () => {
  cartModal.classList.remove('active');
});

// Закрыть по клику на фон
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove('active');
  }
});

// Открыть форму оформления
checkoutBtn.addEventListener('click', () => {
  if (cart.items.length === 0) {
    alert('Корзина пуста');
    return;
  }

  // Meta Pixel: InitiateCheckout
  pixelTracking.trackInitiateCheckout(cart.items, cart.getTotal());

  cartModal.classList.remove('active');
  checkoutModal.classList.add('active');
});

// Закрыть форму оформления
closeCheckout.addEventListener('click', () => {
  checkoutModal.classList.remove('active');
});

checkoutModal.addEventListener('click', (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.classList.remove('active');
  }
});

// Обработка формы заказа
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const orderData = {
    customer: {
      name: document.getElementById('customerName').value,
      email: document.getElementById('customerEmail').value,
      phone: document.getElementById('customerPhone').value,
      address: document.getElementById('customerAddress').value
    },
    items: cart.items,
    total: cart.getTotal(),
    date: new Date().toISOString()
  };

  // Meta Pixel: Purchase
  pixelTracking.trackPurchase(orderData);

  // Сохраняем заказ в localStorage (временно, пока нет бэкенда)
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Очищаем корзину
  cart.clear();

  // Показываем успешное сообщение
  alert('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');

  // Закрываем модалку и сбрасываем форму
  checkoutModal.classList.remove('active');
  checkoutForm.reset();

  console.log('Заказ отправлен:', orderData);
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  cart.updateCartUI();
});
