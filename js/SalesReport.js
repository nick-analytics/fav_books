class SalesReport{
  constructor(orders){
    this.orders = orders;
    this.totalOrders = orders.length;
    this.totalRevenue = orders.reduce((total, order) => total + order.totalAmount, 0);
  }
}




