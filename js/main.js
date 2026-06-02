

const database = new Database();
const authenticator = new Authenticator(database);
const customerController = new CustomerController(database);
const shoppingCart = new ShoppingCart();
const orderProcessor = new OrderProcessor(database);
const storeFront = new StoreFront(database, authenticator, customerController, orderProcessor, null, shoppingCart);
storeFront.bootstrap();