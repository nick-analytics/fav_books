

class StoreFront{
    constructor(database, authenticator, customerController, orderProcessor, reportController){
        this.database = database;
        this.authenticator = authenticator;
        this.customerController = customerController;
        this.orderProcessor = orderProcessor;
        this.reportController = reportController;
        
    }

    bootstrap(){
        if (document.getElementById('formSignIn')) {
            console.log('login page detected');
            this.setupLoginPage();
        }
        if (document.getElementById('cartDrawer')) {
            this.setupCart();
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
            this.navigateLogin(role);
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

    navigateLogin(role) {
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
}