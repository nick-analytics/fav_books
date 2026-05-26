class TransactionRecord {
  constructor(order, paymentMethod) {
    this.transactionId = Date.now().toString();  // Simple unique ID
    this.orderId = order.orderId;
    this.timestamp = new Date().toISOString();
    this.totalAmount = order.getTotal();
    this.paymentMethod = paymentMethod;          // "Card", "Account", etc.
    this.items = order.items;                    // Array of OrderItem objects
  }

  // Convert to plain object for saving or exporting
  toJSON() {
    return {
      transactionId: this.transactionId,
      orderId: this.orderId,
      timestamp: this.timestamp,
      totalAmount: this.totalAmount,
      paymentMethod: this.paymentMethod,
      items: this.items.map(item => ({
        title: item.book.title,
        author: item.book.author,
        quantity: item.quantity,
        price: item.book.price
      }))
    };
  }
}
