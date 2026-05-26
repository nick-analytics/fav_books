

class CustomerController{
    constructor(database){
        this.database = database;
        

    }

    // validate customer register fields
    //validate required fields.
    validateRequiredFields(firstName, lastName, email, password, confirmPassword, phone) {
        if (!firstName || firstName.trim() === ''){
            return 'First name cannot be empty';
        }
        if (!lastName || lastName.trim() === ''){
            return 'Last name cannot be empty';
        }
        if (!email || email.trim() === ''){
            return 'Email cannot be empty';
        }
        if (!password || password.trim() === ''){
            return 'Password cannot be empty';
        }
        if (!phone || phone.trim() === ''){
            return 'Phone cannot be empty';
        }
        if (password !== confirmPassword){
            return 'Passwords do not match';
        }
        return null;
    }
// create customer if validation is correct. 
    createCustomer(firstName, lastName, email, password, phone){
        const id = Date.now();
        return new Customer(id, 'customer', firstName, lastName, email, password, phone, null, []);

    }
    //registers customer

    registerCustomer(firstName, lastName, email, password, confirmPassword, phone){
        const error = this.validateRequiredFields(firstName, lastName, email, password, confirmPassword, phone);
        if (error){
            return error;
        }
        
        const customer = this.createCustomer(firstName, lastName, email, password, phone);
        const users = this.database.getJsonFiles('users');
        users.push(customer);
        this.database.save('users', users);
        return customer;
    }
}