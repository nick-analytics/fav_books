

const database = new Database();
const authenticator = new Authenticator(database);
const customerController = new CustomerController(database);
const shoppingCart = new ShoppingCart();
const storeFront = new StoreFront(database, authenticator, customerController, null, null, shoppingCart);
storeFront.bootstrap();