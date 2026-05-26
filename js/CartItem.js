class CartItem {
  constructor(book, quantity = 1) {
    this.book = book;           // Book object
    this.quantity = quantity;   // Number of copies
  }

  // Increase quantity by 1
  increase() {
    this.quantity++;
  }

  // Decrease quantity but never below 1
  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Calculate subtotal for this item
  getSubtotal() {
    return this.book.price * this.quantity;
  }
}
