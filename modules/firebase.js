const url = 'https://bookread-b2814-default-rtdb.europe-west1.firebasedatabase.app/books.json';

export const getAll = async () =>{
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error(response.status);
        
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        alert("Error loading booklist");
        throw error;
    }
}


export const addBook = async (book, author) => {
    try {
        const newBook = {book, title: book, isFavorite: false, author: author};
        const options = {
            method: 'POST',
            body: JSON.stringify(newBook),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
        
        const response = await fetch(url, options);
        if(!response.ok) throw new Error(response.status);
        const newID = await response.json();
        console.log(newID.name); //firebase skickar tillbaka id:t som genererades
        return {id: newID.name, book, isFavorite: false, author: author};
    } catch (error) {
        alert("Error adding book");
        throw error;
    }
}