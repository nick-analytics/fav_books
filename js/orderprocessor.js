class OrderProcessor {
    constructor(database) {
        this.database = database;
    }

    // Creates a new Order from the current shopping cart and saves it
    processOrder(cart, customer, shippingAddress, paymentMethod) {
        const orders = this.database.getJsonFiles('orders') || [];

        const id = Date.now();
        const subtotal = cart.getTotal();
        const shipping = this.calculateShipping(subtotal);
        const totalAmount = subtotal + shipping;

        const order = new Order(
            id,
            customer.id,
            'pending',
            new Date().toISOString(),
            cart.items,
            subtotal,
            shipping,
            totalAmount,
            shippingAddress,
            null
        );

        const transactionRecord = new TransactionRecord(order, paymentMethod);
        order.transactionRecord = transactionRecord.toJSON();
        order.status = 'confirmed';

        orders.push(order);
        this.database.save('orders', orders);

        return order;
    }

    // Returns all orders for a given customerId
    getOrdersByCustomer(customerId) {
        const orders = this.database.getJsonFiles('orders') || [];
        return orders.filter(order => order.customerId === customerId);
    }

    // Updates the status of an order (pending -> confirmed -> packaged -> dispatched)
    updateOrderStatus(orderId, newStatus) {
        const orders = this.database.getJsonFiles('orders') || [];
        const order = orders.find(o => o.id === orderId);
        if (!order) return false;

        order.status = newStatus;
        this.database.save('orders', orders);
        return true;
    }

    // Calculates flat shipping rate (free over $50)
    calculateShipping(subtotal) {
        return subtotal >= 50 ? 0 : 7.99;
    }
}
