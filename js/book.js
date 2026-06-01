class Book {
    constructor(id, isbn, title, author, genre, description, price, onSale, salePrice, stock, cover, format) {
        this.id = id;
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.description = description;
        this.price = price;
        this.onSale = onSale;
        this.salePrice = salePrice;
        this.stock = stock;
        this.cover = cover;
        this.format = format;
    }

    // Returns the effective price (sale price if on sale, otherwise regular price)
    getEffectivePrice() {
        return this.onSale && this.salePrice ? this.salePrice : this.price;
    }

    // Returns true if the book has stock available
    isInStock() {
        return this.stock > 0;
    }

    // Reduces stock by the given quantity, returns false if insufficient stock
    reduceStock(quantity) {
        if (quantity > this.stock) {
            return false;
        }
        this.stock -= quantity;
        return true;
    }
}
