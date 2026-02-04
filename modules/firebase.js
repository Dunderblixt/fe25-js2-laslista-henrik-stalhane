const url = 'https://bookread-b2814-default-rtdb.europe-west1.firebasedatabase.app/books.json';
let books = [];
let onlyFavorites = false;
let currentSort = null;
const form = document.getElementById('book-form');
const bookContainer = document.getElementById('book-container');
const sortAZBtn = document.getElementById('sort-az-btn');
const sortZABtn = document.getElementById('sort-za-btn');
const sortOldestBtn = document.getElementById('sort-oldest-btn');
const sortYoungestBtn = document.getElementById('sort-youngest-btn');
const onlyFavoritesBtn = document.getElementById('only-favorites-btn');
const showAllBtn = document.getElementById('show-all-btn');
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
        console.log(newID.name);
        return {id: newID.name, book, isFavorite: false, author: author};
    } catch (error) {
        alert("Error adding book");
        throw error;
    }
}
export const loadBooks = data => {
    books = [];
    const sortedData = applySorting(data);
    const filteredData = filterDataByFavorites(sortedData);
    for (const key in filteredData) {
        books.push(new Book(key, filteredData[key].title, filteredData[key].isFavorite, filteredData[key].author));
    }
    bookContainer.innerHTML = '';
    books.forEach(book => book.render(bookContainer));
};

export const applySorting = data => {
    if (!currentSort) return data;
    
    if (currentSort === 'az') return sortDataByTitle(data, 'asc');
    if (currentSort === 'za') return sortDataByTitle(data, 'desc');
    if (currentSort === 'oldest') return orderByInsertion(data, false);
    if (currentSort === 'youngest') return orderByInsertion(data, true);
    
    return data;
};

export const filterDataByFavorites = data => {
    if (!onlyFavorites) {
        return data || {};
    }
    const filteredData = {};
    for (const key in (data || {})) {
        if (data[key].isFavorite) {
            filteredData[key] = data[key];
        }
    }
    return filteredData;
};

export const sortDataByTitle = (data, direction = 'asc') => {
    const entries = Object.entries(data || {});
    entries.sort(([, a], [, b]) => {
        const titleA = (a.title || '').toLocaleUpperCase();
        const titleB = (b.title || '').toLocaleUpperCase();
        if (titleA < titleB) return direction === 'asc' ? -1 : 1;
        if (titleA > titleB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    const sortedData = {};
    entries.forEach(([key, value]) => {
        sortedData[key] = value;
    });
    return sortedData;
};

export const orderByInsertion = (data, youngestFirst = false) => {
    const keys = Object.keys(data || {});
    if (youngestFirst) {
        keys.reverse();
    }
    const orderedData = {};
    keys.forEach(key => {
        orderedData[key] = data[key];
    });
    return orderedData;
};