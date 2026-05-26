

class Database{
    constructor(){
        this.initialise()
    }

// initlisation method to call json files 
async initialise(){
    const booksFilePath = '../json/books.json';
    const usersFilePath = '../json/users.json';
    const ordersFilePath = '../json/orders.json';

    try {
        if (!localStorage.getItem('books')){
            const response = await  fetch(booksFilePath);
            const data = await response.json();
            localStorage.setItem('books', JSON.stringify(data));
        }
        if (!localStorage.getItem('users')){
            const response = await  fetch(usersFilePath);
            const data = await response.json();
            localStorage.setItem('users', JSON.stringify(data));
        }
        if (!localStorage.getItem('orders')){
            const response = await  fetch(ordersFilePath);
            const data = await response.json();
            localStorage.setItem('orders', JSON.stringify(data));
        }
    } catch (error){
        console.error("Error loading JSON:", error)
    }

}
}