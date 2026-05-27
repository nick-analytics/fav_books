

class ShoppingCart{
    constructor(){
        this.items = [];

    }

    addItem(book){
        
        const existingItem = this.items.find(item => item.book.id === book.id);

        if (existingItem){
            existingItem.increase();
        } else {
            const newItem = new CartItem(book);
            this.items.push(newItem);
        }
    }

    decreaseItem(bookId) {
        const existingItem = this.items.find(item => item.book.id === bookId);

        if (existingItem) {
            existingItem.decrease();
            if (existingItem.quantity === 0) {
                this.removeItem(bookId);
            }
        }
    }

    removeItem(bookId) {
        this.items = this.items.filter(item => item.book.id !== bookId);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
    }
}