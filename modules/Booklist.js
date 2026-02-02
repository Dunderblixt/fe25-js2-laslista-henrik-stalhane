export class Book {
    #id;
    #title;
    #isFavorite;
    #author;
    #url

    constructor(id, title, isFavorite, author) {
        this.#id = id;
        this.#title = title;
        this.#isFavorite = isFavorite;
        this.#author = author;
        this.#url = `https://bookread-b2814-default-rtdb.europe-west1.firebasedatabase.app/books/${this.#id}.json`;
    }
    render(container){
        const bookDiv = document.createElement('div');
        const p = document.createElement('p');
        const favButton = document.createElement('button');
        const deleteButton = document.createElement('button');
        bookDiv.id = this.#id;
        bookDiv.classList.add('book-item');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            this.delete().then(() => {
                container.removeChild(bookDiv);
            });
        });
        p.innerHTML = `${this.#title} by ${this.#author}`;
        favButton.textContent = this.#isFavorite ? 'Unfavorite' : 'Favorite';
        if(this.#isFavorite){
            favButton.classList.add('favorite');
        }
        favButton.addEventListener('click', () => this.toggleFavorite(favButton));
        bookDiv.appendChild(p);
        bookDiv.appendChild(favButton);
        bookDiv.appendChild(deleteButton);
        container.appendChild(bookDiv);
        if (this.#isFavorite){
            bookDiv.style.color = 'green';
        }
        else {
            bookDiv.style.color = 'black';
        }

    }  
    async delete(){
        try {
            const response = await fetch(this.#url, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }

    async toggleFavorite(button){
        this.#isFavorite = !this.#isFavorite;
        button.textContent = this.#isFavorite ? 'Unfavorite' : 'Favorite';  
        if(this.#isFavorite){
            button.classList.add('favorite');
            button.classList.remove('hidden');
        }
        else {
            button.classList.remove('favorite');
            button.classList.add('hidden');
        }
        
        // Update color immediately
        const bookDiv = button.parentElement;
        if (bookDiv) {
            bookDiv.style.color = this.#isFavorite ? 'green' : 'black';
        }
        
        try {
            const response = await fetch(this.#url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isFavorite: this.#isFavorite })
            });
            if (!response.ok) {
                throw new Error('Failed to update favorite status');
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    }

}
