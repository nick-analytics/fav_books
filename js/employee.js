//inherites from USer for employee privilages

class Employee extends User{
    constructor(id, role, firstName, lastName, email, password){
        super(id, role, firstName, lastName, email, password);

    }
}