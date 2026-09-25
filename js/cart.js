// Корзина в localStorage
class Cart {
  constructor() {
    this.items = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateCartUI();
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        ...product,
        quantity: 1
      });
    }
    
    this.saveCart();
    
    // Meta Pixel: AddToCart событие
    if (typeof fbq !== 'undefined') {
      fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'EUR'
      });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  updateCartUI() {
    // Обновляем счетчик в шапке
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.textContent = this.getItemCount();
    }

    // Обновляем содержимое корзины
    this.renderCartItems();
  }

  renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    if (!cartItemsContainer) return;

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = '<div class="empty-cart">Cart is empty</div>';
      if (totalPrice) totalPrice.textContent = '0 €';
      return;
    }

    cartItemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-image">${item.image}</div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <div class="cart-item-price">
            ${item.price} ${item.currency} × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} ${item.currency}
          </div>
        </div>
        <button class="remove-item" data-id="${item.id}">Удалить</button>
      </div>
    `).join('');

    if (totalPrice) {
      totalPrice.textContent = `${this.getTotal().toFixed(2)} €`;
    }

    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        this.removeItem(productId);
      });
    });
  }
}

// Создаем глобальный экземпляр корзины
window.cart = new Cart();
