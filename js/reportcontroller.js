class ReportController {
    constructor(database) {
        this.database = database;
    }

    // Builds and returns a SalesReport from all stored orders
    generateSalesReport() {
        const orders = this.database.getJsonFiles('orders') || [];
        return new SalesReport(orders);
    }

    // Returns a SalesReport filtered to orders within a date range (inclusive)
    // dateFrom and dateTo are ISO date strings ('2025-01-01')
    generateReportByDateRange(dateFrom, dateTo) {
        const orders = this.database.getJsonFiles('orders') || [];
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999); // include the full end day

        const filtered = orders.filter(order => {
            const created = new Date(order.createdAt);
            return created >= from && created <= to;
        });

        return new SalesReport(filtered);
    }

    // Returns a SalesReport filtered to orders for a specific customerId
    generateReportByCustomer(customerId) {
        const orders = this.database.getJsonFiles('orders') || [];
        const filtered = orders.filter(order => order.customerId === customerId);
        return new SalesReport(filtered);
    }

    // Returns all orders with a given status ('pending', 'confirmed', 'dispatched')
    getOrdersByStatus(status) {
        const orders = this.database.getJsonFiles('orders') || [];
        return orders.filter(order => order.status === status);
    }
}
