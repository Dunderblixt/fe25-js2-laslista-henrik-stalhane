import { Book } from "./modules/Booklist.js";  
import { getAll, addBook } from "./modules/firebase.js";

const form = document.getElementById('book-form');
let books = [];
const bookContainer = document.getElementById('book-container');
let onlyFavorites = false;
let currentSort = null;

const applySorting = data => {
    if (!currentSort) return data;
    
    if (currentSort === 'az') return sortDataByTitle(data, 'asc');
    if (currentSort === 'za') return sortDataByTitle(data, 'desc');
    if (currentSort === 'oldest') return orderByInsertion(data, false);
    if (currentSort === 'youngest') return orderByInsertion(data, true);
    
    return data;
};

const filterDataByFavorites = data => {
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

const loadBooks = data => {
    books = [];
    const sortedData = applySorting(data);
    const filteredData = filterDataByFavorites(sortedData);
    for (const key in filteredData) {
        books.push(new Book(key, filteredData[key].title, filteredData[key].isFavorite, filteredData[key].author));
    }
    bookContainer.innerHTML = '';
    books.forEach(book => book.render(bookContainer));
}

getAll()
    .then(loadBooks)

form.addEventListener('submit', event => {
    event.preventDefault();
    const newBook = form['book-input'].value.trim();
    const newAuthor = form['author-input'].value.trim();
    if (newBook && newAuthor) {
        books = [];
        addBook(newBook, newAuthor)
            .then(() => getAll())
            .then(loadBooks);
        form.reset();
    }
});



const sortDataByTitle = (data, direction = 'asc') => {
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

const orderByInsertion = (data, youngestFirst = false) => {
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

const sortAZBtn = document.getElementById('sort-az-btn');
const sortZABtn = document.getElementById('sort-za-btn');
const sortOldestBtn = document.getElementById('sort-oldest-btn');
const sortYoungestBtn = document.getElementById('sort-youngest-btn');
const onlyFavoritesBtn = document.getElementById('only-favorites-btn');
const showAllBtn = document.getElementById('show-all-btn');
if (sortAZBtn) {
    sortAZBtn.addEventListener('click', () => {
        currentSort = 'az';
        getAll()
            .then(loadBooks);
    });
}

if (sortZABtn) {
    sortZABtn.addEventListener('click', () => {
        currentSort = 'za';
        getAll()
            .then(loadBooks);
    });
}

if (sortOldestBtn) {
    sortOldestBtn.addEventListener('click', () => {
        currentSort = 'oldest';
        getAll()
            .then(loadBooks);
    });
}

if (sortYoungestBtn) {
    sortYoungestBtn.addEventListener('click', () => {
        currentSort = 'youngest';
        getAll()
            .then(loadBooks);
    });
}


onlyFavoritesBtn.addEventListener('click', () => {
    onlyFavorites = true;
    books = [];
    getAll()
        .then(loadBooks);
});

showAllBtn.addEventListener('click', () => {
    onlyFavorites = false;
    books = [];
    getAll()
        .then(loadBooks);
});
