

class Authenticator{
    constructor(database){
        this.database = database;

    }

    validateLogin(email, password){
       const users = this.database.getJsonFiles('users');
       const user = users.find(u => u.email === email);

       if (!user){
        return "User email not found"
       } 
       if (user.password === password){
        return user
       }
       else {
        return 'Incorrect password';
       }

    }

    getRole(user){
        const userRole = user.role;
        return userRole;
    }
}