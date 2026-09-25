// Функции для отправки событий Meta Pixel

// Событие просмотра товара
function trackViewContent(product) {
  if (typeof fbq !== 'undefined') {
    fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'EUR'
    });
  }
}

// Событие начала оформления заказа
function trackInitiateCheckout(cartItems, totalValue) {
  if (typeof fbq !== 'undefined') {
    fbq('track', 'InitiateCheckout', {
      content_ids: cartItems.map(item => item.id),
      contents: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      })),
      value: totalValue,
      currency: 'EUR',
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  }
}

// Событие завершения покупки
function trackPurchase(orderData) {
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Purchase', {
      content_ids: orderData.items.map(item => item.id),
      contents: orderData.items.map(item => ({
        id: item.id,
        quantity: item.quantity
      })),
      value: orderData.total,
      currency: 'EUR',
      num_items: orderData.items.reduce((sum, item) => sum + item.quantity, 0)
    });
  }
}

// Событие поиска (для будущего, когда добавишь поиск)
function trackSearch(searchQuery) {
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Search', {
      search_string: searchQuery
    });
  }
}

// Экспорт функций
window.pixelTracking = {
  trackViewContent,
  trackInitiateCheckout,
  trackPurchase,
  trackSearch
};
