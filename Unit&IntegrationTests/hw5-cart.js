// cart.js
function calculateCartTotal(cartItems, discountCode = '') {
    if (!Array.isArray(cartItems)) {
    throw new Error('cartItems must be an array');
  }

  if (cartItems.length === 0) {
    return { total: 0, discountApplied: 0, finalTotal: 0, items: [] };
  }

  
  const processedItems = cartItems.map((item) => {
    if (!item || typeof item.price !== 'number' || item.price < 0 || !item.name) {
      throw new Error('Invalid item in cart: price and name are required');
    }
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
    return {
      name: item.name,
      price: item.price,
      quantity,
      subtotal: item.price * quantity,
    };
  });

  const total = processedItems.reduce((sum, item) => sum + item.subtotal, 0);

  
  let discountApplied = 0;
  if (discountCode) {
    switch (discountCode.toUpperCase()) {
      case 'SAVE10':
        discountApplied = total * 0.1; 
        break;
      case 'SAVE20':
        discountApplied = total * 0.2; 
        break;
      case 'FREESHIP':
        discountApplied = total >= 50 ? 5 : 0; 
        break;
      default:
        discountApplied = 0; 
    }
  }

  const finalTotal = Math.max(total - discountApplied, 0); 

  return {
    total: Number(total.toFixed(2)),           
    discountApplied: Number(discountApplied.toFixed(2)), 
    finalTotal: Number(finalTotal.toFixed(2)), 
    items: processedItems,                     
  };
}

module.exports = calculateCartTotal;