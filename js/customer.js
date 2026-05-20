//customer class inheritaes from user

class Customer extends User{
    constructor(id, role, firstName, lastName, email, password, phone, address, orderHistory){
        super(id, role, firstName, lastName, email, password);
        this.phone = phone;
        this.address = address;
        this.orderHistory = orderHistory;

    }


    //getter method to return address
    getAddress() {
        return this.address;
    }
}