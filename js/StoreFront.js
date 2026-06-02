

class StoreFront{
    constructor(database, authenticator, customerController, orderProcessor, reportController, shoppingCart){
        this.database = database;
        this.authenticator = authenticator;
        this.customerController = customerController;
        this.orderProcessor = orderProcessor;
        this.reportController = reportController;
        this.shoppingCart = shoppingCart;
        
    }

    bootstrap(){
        console.log('saved cart:', localStorage.getItem('cart'));
        console.log('on book page:', document.querySelector('.book-detail-title'));
        const loggedInUser = localStorage.getItem('loggedInUser');
        const authBtn = document.querySelector('.btn-auth');

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            JSON.parse(savedCart).forEach(item => {
                const cartItem = new CartItem(item.book, item.quantity);
                this.shoppingCart.items.push(cartItem);
            });
        }
        this.updateCart();
        
        if (loggedInUser) {
            authBtn.textContent = 'Logout';
            authBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                window.location.href = '../html/index.html';
            });
        }
        if (document.getElementById('formSignIn')) {
            console.log('login page detected');
            this.setupLoginPage();
        }
        if (document.getElementById('cartDrawer')) {
            this.setupCart();
        }
        if (document.getElementById('accountGreeting')) {
            const userId = localStorage.getItem('loggedInUser');
            const users = this.database.getJsonFiles('users');
            const user = users.find(u => u.id == userId);
            document.getElementById('accountGreeting').textContent = `Hi, ${user.firstName}`;
        }
        if (document.getElementById('btnGenerateReport')) {
            this.setupDashboard();
        }
        if (document.querySelector('[data-genre="Fiction"]')){
            this.setupBooks();
        }   
        if (document.querySelector('.book-detail-title')) {
            this.setupBookPage();
        }
        if (document.querySelector('.btn-place-order')) {
            this.setupCheckoutPage();
        }
        if (document.querySelector('.confirmation-heading')) {
            this.setupConfirmationPage();
        }
        

        
    }
    
// login/join page methods
    setupLoginPage(){
        console.log('setupLoginPage running');
        const signInBtn = document.getElementById('btnSignIn');
        const joinBtn = document.getElementById('btnJoin');
        joinBtn.addEventListener('click', () => {
            console.log('join clicked');
            this.setupJoinForm();
        });
        signInBtn.addEventListener( 'click', () => {
            console.log('sign in clicked');
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            const user = this.authenticator.validateLogin(email, password);

            if (!user || typeof user === 'string') {
                document.getElementById('signin-error').textContent = user;
                return;
            }
            const role = this.authenticator.getRole(user);
            this.navigateLogin(role, user);
        })
    }

    setupJoinForm(){
        document.getElementById('formSignIn').classList.add('login-form--hidden');
        document.getElementById('formJoin').classList.remove('login-form--hidden');
        const createAccount = document.getElementById('btnCreateAccount');

        createAccount.addEventListener('click', () => {
            console.log('create clicked');
             const firstName = document.getElementById('join-firstname').value;
             const lastName = document.getElementById('join-lastname').value;
             const email = document.getElementById('join-email').value;
             const phone = document.getElementById('join-phone').value;
             const password = document.getElementById('join-password').value;
             const confirmPassword = document.getElementById('join-confirm-password').value;

             const result = this.customerController.registerCustomer(firstName, lastName, email, password, confirmPassword, phone);
            
             if (typeof result === 'string') {
                 document.getElementById('join-error').textContent = result;
                 return;
             }
            
             window.location.href = '../html/index.html';
            
        });
    }

    navigateLogin(role, user) {
        localStorage.setItem('loggedInUser', user.id);

        if (role === 'customer'){
            window.location.href = '../html/account.html';
        }
        if (role === 'employee'){
            window.location.href = '../html/dashboard.html';
        }
    }
// shopping cart drawer methods
    setupCart(){
        const cartBtn = document.querySelector('.btn-cart');
        const drawer = document.getElementById('cartDrawer');
        const backdrop = document.getElementById('cartBackdrop');

        cartBtn.addEventListener('click', () => {
            drawer.classList.add('cart-drawer--open');
            backdrop.classList.add('cart-backdrop--visible');
        });

        backdrop.addEventListener('click', () => {
            drawer.classList.remove('cart-drawer--open');
            backdrop.classList.remove('cart-backdrop--visible');
        });
    }

    //dashboard methods 

    setupDashboard() {
        console.log('setupDashboard running');
        const btnGenerate = document.getElementById('btnGenerateReport');
    
        btnGenerate.addEventListener('click', () => {
            const orders = this.database.getJsonFiles('orders');
            const report = new SalesReport(orders);
            this.renderReport(report);
        });
    }

    renderReport(report) {
        const reportOutput = document.getElementById('dashboardReport');
        reportOutput.innerHTML = `
            <h2 class="dashboard-report-heading">Sales Report</h2>
            <p>Total Orders: ${report.totalOrders}</p>
            <p>Total Revenue: $${report.totalRevenue.toFixed(2)}</p>
        `;
    }

    //book methods. 

    setupBooks(){
        const books = this.database.getJsonFiles('books');
        const fictionBooks = books.filter(book => book.genre === 'Fiction');
        const fictionShelf = document.querySelector('[data-genre="Fiction"]');
        const cards = fictionShelf.querySelectorAll('.book-card');
    
        fictionBooks.forEach((book, index) => {
            if (cards[index]) {
                cards[index].querySelector('.book-title').textContent = book.title;
                cards[index].querySelector('.book-author').textContent = book.author;
                cards[index].querySelector('.book-price span').textContent = book.price;
                cards[index].setAttribute('data-book-id', book.id);
                cards[index].style.cursor = 'pointer';
                cards[index].addEventListener('click', () => {
                    window.location.href = `book.html?id=${book.id}`;
                });
            }
        });
    }

    setupBookPage() {
        console.log('setupBookPage running');       
        console.log('URL:', window.location.search);
        const params = new URLSearchParams(window.location.search);
        const bookId = parseInt(params.get('id'));
        const books = this.database.getJsonFiles('books');
        const book = books.find(b => b.id === bookId);
        
        if (!book) return;
        
            document.querySelector('.book-detail-title').textContent = book.title;
            document.querySelector('.book-detail-author').textContent = `by ${book.author}`;
            document.querySelector('.book-detail-description').textContent = book.description;
            document.querySelector('.book-detail-price-value').textContent = book.price;
            document.querySelector('.book-detail-genre').textContent = book.genre;

            const addToCartBtn = document.querySelector('.btn-add-to-cart');
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('book-quantity').value);
                for (let i = 0; i < quantity; i++) {
                    this.shoppingCart.addItem(book);
                }
                this.updateCart();
            });
    }


    updateCart() {
        console.log('updateCart running', this.shoppingCart.items.length);
        console.log('cartCount element:', document.getElementById('cartCount'));
            const cartItems = document.getElementById('cartItems');
            const cartCount = document.getElementById('cartCount');
            const cartSubtotal = document.getElementById('cartSubtotal');
             if (!cartItems) return;

            cartCount.textContent = this.shoppingCart.items.reduce((total, item) => total + item.quantity, 0);
            cartSubtotal.textContent = `$${this.shoppingCart.getTotal().toFixed(2)}`;
            document.querySelector('.cart-count').textContent = this.shoppingCart.items.length;

            cartItems.innerHTML = '';

            this.shoppingCart.items.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';

                const cover = document.createElement('div');
                cover.className = 'cart-item-cover';
                const placeholder = document.createElement('div');
                placeholder.className = 'cart-cover-placeholder';
                cover.appendChild(placeholder);

                const details = document.createElement('div');
                details.className = 'cart-item-details';

                const top = document.createElement('div');
                top.className = 'cart-item-top';

                const info = document.createElement('div');
                info.className = 'cart-item-info';
                const title = document.createElement('p');
                title.className = 'cart-item-title';
                title.textContent = item.book.title;
                const author = document.createElement('p');
                author.className = 'cart-item-author';
                author.textContent = item.book.author;
                info.appendChild(title);
                info.appendChild(author);

                const quantityDiv = document.createElement('div');
                quantityDiv.className = 'cart-item-quantity';

                const decreaseBtn = document.createElement('button');
                decreaseBtn.className = 'quantity-btn';
                decreaseBtn.textContent = '−';
                decreaseBtn.addEventListener('click', () => {
                    this.shoppingCart.decreaseItem(item.book.id);
                    this.updateCart();
                });

                const quantitySpan = document.createElement('span');
                quantitySpan.className = 'quantity-value';
                quantitySpan.textContent = item.quantity;

                const increaseBtn = document.createElement('button');
                increaseBtn.className = 'quantity-btn';
                increaseBtn.textContent = '+';
                increaseBtn.addEventListener('click', () => {
                    this.shoppingCart.addItem(item.book);
                    this.updateCart();
                });

                quantityDiv.appendChild(decreaseBtn);
                quantityDiv.appendChild(quantitySpan);
                quantityDiv.appendChild(increaseBtn);

                top.appendChild(info);
                top.appendChild(quantityDiv);

                const price = document.createElement('p');
                price.className = 'cart-item-price';
                price.textContent = `$${item.getSubtotal().toFixed(2)}`;

                details.appendChild(top);
                details.appendChild(price);

                cartItem.appendChild(cover);
                cartItem.appendChild(details);

                cartItems.appendChild(cartItem);
            });
            document.querySelector('.cart-count').textContent = this.shoppingCart.items.length;
            localStorage.setItem('cart', JSON.stringify(this.shoppingCart.items));
            console.log('cart saved:', localStorage.getItem('cart'));
    }

    setupCheckoutPage() {
        const userId = localStorage.getItem('loggedInUser');
        const users = this.database.getJsonFiles('users');
        const user = users.find(u => u.id == userId);

        if (user) {
            document.getElementById('ship-firstname').value = user.firstName;
            document.getElementById('ship-lastname').value = user.lastName;
        }

        const orderItems = document.querySelector('.order-items');
        orderItems.innerHTML = '';
        
        this.shoppingCart.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <div class="order-item-cover"><div class="order-cover-placeholder"></div></div>
                <div class="order-item-details">
                    <div class="order-item-top">
                        <div class="order-item-info">
                            <p class="order-item-title">${item.book.title}</p>
                            <p class="order-item-author">${item.book.author}</p>
                        </div>
                        <span class="quantity-value">x${item.quantity}</span>
                    </div>
                    <p class="order-item-price">$${item.getSubtotal().toFixed(2)}</p>
                </div>
            `;
            orderItems.appendChild(div);
        });

        const subtotal = this.shoppingCart.getTotal();
        const shipping = subtotal >= 50 ? 0 : 7.99;
        const total = subtotal + shipping;
        const totalsRows = document.querySelectorAll('.order-totals-value');
        totalsRows[0].textContent = `$${subtotal.toFixed(2)}`;
        totalsRows[1].textContent = `$${shipping.toFixed(2)}`;
        totalsRows[2].textContent = `$${total.toFixed(2)}`;

        this.setupAddressForm(user);
    }

    setupAddressForm(user) {
        let savedAddress = null;

        document.querySelector('.btn-save-address').addEventListener('click', () => {
            const address = new Address(
                document.getElementById('ship-address1').value,
                document.getElementById('ship-address2').value,
                document.getElementById('ship-city').value,
                document.getElementById('ship-state').value,
                document.getElementById('ship-postcode').value
            );

            const error = address.validateRequiredFields() || address.validateFormat() || address.validateStatePostcodeMatch();
            if (error) {
                alert(error);
                return;
            }

            savedAddress = address;
            alert('Address saved!');
        });

        document.querySelector('.btn-place-order').addEventListener('click', () => {
            if (!savedAddress) {
                alert('Please save your address first');
                return;
            }

            const order = this.orderProcessor.processOrder(
                this.shoppingCart,
                user,
                savedAddress,
                'Visa •••• 4242'
            );

            localStorage.setItem('lastOrder', JSON.stringify(order));
            localStorage.removeItem('cart');
            this.shoppingCart.items = [];
            window.location.href = 'confirmation.html';
        });
    }

    setupConfirmationPage() {
        const order = JSON.parse(localStorage.getItem('lastOrder'));
        const userId = localStorage.getItem('loggedInUser');
        const users = this.database.getJsonFiles('users');
        const user = users.find(u => u.id == userId);

        if (!order || !user) return;

        document.querySelector('.confirmation-heading').textContent = `Thanks, ${user.firstName}`;
        document.querySelector('.confirmation-receipt').textContent = `Receipt sent to ${user.email}`;
        document.querySelector('.confirmation-detail-value--large').textContent = `#${order.id}`;

        const itemsContainer = document.querySelector('.confirmation-items');
        itemsContainer.innerHTML = '';

        order.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'confirmation-item';
            div.innerHTML = `
                <div class="confirmation-item-cover">
                    <div class="confirmation-cover-placeholder"></div>
                </div>
                <div class="confirmation-item-details">
                    <div class="confirmation-item-top">
                        <div class="confirmation-item-info">
                            <p class="confirmation-item-title">${item.book.title}</p>
                            <p class="confirmation-item-author">${item.book.author}</p>
                        </div>
                        <span class="quantity-value">x${item.quantity}</span>
                    </div>
                    <p class="confirmation-item-price">$${(item.book.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
            itemsContainer.appendChild(div);
        });

        document.querySelector('.confirmation-subtotal-value').textContent = `$${order.totalAmount.toFixed(2)}`;
    }

    
}