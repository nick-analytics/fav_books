

class Order {
    constructor(id, customerId, status, createdAt, items, subtotal, shipping, totalAmount, shippingAddress, transactionRecord) {
        this.id = id;
        this.customerId = customerId;
        this.status = status;
        this.createdAt = createdAt;
        this.items = items;
        this.subtotal = subtotal;
        this.shipping = shipping;
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.transactionRecord = transactionRecord;
    }

    getTotal() {
        return this.totalAmount;
    }

    getStatus() {
        return this.status;
    }
}