

class CustomerController{
    constructor(database, authenticator){
        this.database = database;
        this.authenticator = authenticator;

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
}