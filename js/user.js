//Parent class. Holds user information. 

class User{
    constructor(id, role, firstName, lastName, email, password){
        this.id = id;
        this.role = role,
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    //methods shared by both 
    getFullName(){
        return `${this.firstName} ${this.lastName}`;
        
    }

    //getter method for role. 
    getRole() {
        return this.role;
    }
}