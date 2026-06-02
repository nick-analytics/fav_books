

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

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            JSON.parse(savedCart).forEach(item => {
                const cartItem = new CartItem(item.book, item.quantity);
                this.shoppingCart.items.push(cartItem);
            });
        }
        this.updateCart();
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
}