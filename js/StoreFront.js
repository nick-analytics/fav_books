

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
    }

    setupLoginPage(){
        console.log('setupLoginPage running');
        const signInBtn = document.getElementById('btnSignIn');
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

    navigateLogin(role) {
        if (role === 'customer'){
            window.location.href = '../html/account.html';
        }
        if (role === 'employee'){
            window.location.href = '../html/dashboard.html';
        }
    }
}