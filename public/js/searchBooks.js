
let allBooks = []; // to store original book data

// Load books (modified version of loadBooks to store global data)
async function loadBooks() {
  try {
    const response = await fetch('../json/books.json');
    if (!response.ok) throw new Error('Failed to load books.json');
    allBooks = await response.json();

    renderBooks(allBooks); // initial render
  } catch (error) {
    console.error('Error loading books:', error);
    document.getElementById('book-grid').innerHTML =
      '<p class="muted">Unable to load books at this time.</p>';
  }
}

// Render books to grid
function renderBooks(books) {
  const grid = document.getElementById('book-grid');
  grid.innerHTML = '';

  if (!books.length) {
    grid.innerHTML = '<p class="muted text-center">No books found matching your search.</p>';
    return;
  }

  books.forEach(book => {
    const slug = book.title.replace(/\s+/g, '-').toLowerCase();
    const card = document.createElement('div');
    card.className = 'group cursor-pointer';
    card.setAttribute('onclick', `openBookModal('${slug}')`);
    card.innerHTML = `
      <div class="relative overflow-hidden rounded-xl literary-shadow group-hover:literary-shadow-prominent literary-transition">
        <img src="${book.cover}" 
             alt="${book.title}" 
             class="w-full h-80 object-cover group-hover:scale-105 literary-transition-medium"
             loading="lazy"
             onerror="this.src='https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'; this.onerror=null;">
        <div class="absolute top-4 right-4 bg-accent text-white px-2 py-1 rounded-full text-xs font-cta font-medium">
          ${book.badge || 'Featured'}
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 literary-transition"></div>
        <div class="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 literary-transition">
          <button class="preview-button w-full bg-accent hover:bg-accent-700 text-white py-2 rounded-lg font-cta font-medium literary-transition" data-slug="${slug}">
            Preview Book
          </button>
        </div>
      </div>
      <div class="mt-4">
        <h3 class="font-display font-bold text-lg text-primary mb-1">${book.title}</h3>
        <p class="text-text-secondary text-sm mb-2">by ${book.author}</p>
        <div class="flex items-center mb-2">
          <div class="flex text-accent">
            ${'<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>'.repeat(5)}
          </div>
          <span class="ml-2 text-sm text-text-secondary">${new Date(book.date).getFullYear()}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-text-secondary">${book.genre || 'General'}</span>
          <span class="text-lg font-display font-bold text-primary">${book.price || ''}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Search functionality
function searchBooks(query) {
  const filtered = allBooks.filter(book => {
    const searchTerm = query.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      (book.genre && book.genre.toLowerCase().includes(searchTerm))
    );
  });
  renderBooks(filtered);
}

// Attach event listener
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', e => {
    searchBooks(e.target.value);
  });
});

