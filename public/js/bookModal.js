
let booksData = [];
let detailsData = [];
let previewsData = [];

async function fetchBookData() {
  try {
    const [booksRes, detailsRes, previewsRes] = await Promise.all([
      fetch('../json/books.json'),
      fetch('../json/bookDetails.json'),
      fetch('../json/bookPreview.json')
    ]);

    if (!booksRes.ok || !detailsRes.ok || !previewsRes.ok)
      throw new Error("Failed to load JSON files");

    booksData = await booksRes.json();
    detailsData = await detailsRes.json();
    previewsData = await previewsRes.json();
  } catch (err) {
    console.error("Error loading book data:", err);
  }
}

function openBookModal(slug) {
  const book = booksData.find(b => b.title.replace(/\s+/g, '-').toLowerCase() === slug);
  const details = detailsData.find(d => d.slug === slug);
  const preview = previewsData.find(p => p.slug === slug);
  if (!book) return;

  // Fill modal data
  document.getElementById('modal-title').textContent = book.title;
  document.getElementById('modal-author').textContent = `by ${book.author}`;
  document.getElementById('modal-cover').src = book.cover;

  // Metadata
  const metaEls = document.querySelectorAll('#book-modal .text-primary.font-medium');
  if (metaEls.length >= 4) {
    metaEls[0].textContent = book.genre;
    metaEls[1].textContent = details?.pages || "N/A";
    metaEls[2].textContent = new Date(book.date).getFullYear();
    metaEls[3].textContent = details?.language || "English";
  }

  // Price
  document.querySelector('#book-modal .text-2xl.font-display.font-bold').textContent = book.price || '';

  // Rating
  const starsContainer = document.querySelector('#book-modal .flex.text-accent');
  starsContainer.innerHTML = '';
  if (details?.rating) {
    const rating = Math.round(details.rating);
    for (let i = 0; i < 5; i++) {
      starsContainer.innerHTML += `<svg class="w-5 h-5 fill-current ${i < rating ? '' : 'opacity-30'}" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>`;
    }
    document.querySelector('#book-modal .ml-2.text-text-secondary').textContent =
      `${details.rating.toFixed(1)} (${details.reviewCount} reviews)`;
  }

  // Description Tab
  document.querySelector('#description-tab .prose').innerHTML =
    `<p class="text-text-secondary leading-relaxed">${book.description}</p>`;

  // Preview Tab
  if (preview) {
    document.querySelector('#preview-tab .bg-surface').innerHTML = `
      <h4 class="font-display font-bold text-lg text-primary mb-4">${preview.previewTitle}</h4>
      <div class="prose max-w-none text-text-secondary">
        ${preview.previewText.map(p => `<p class="mb-4">${p}</p>`).join('')}
      </div>
    `;
  }

  // Reviews Tab
  const reviewsTab = document.getElementById('reviews-tab');
  reviewsTab.innerHTML = details?.reviews.length
    ? details.reviews.map(r => `
        <div class="border-b border-border pb-6">
          <div class="flex items-center mb-3">
            <div class="flex text-accent">
              ${'<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>'.repeat(r.rating)}
            </div>
            <span class="ml-2 font-cta font-medium text-primary">${r.reviewer}</span>
            <span class="ml-2 text-sm text-text-secondary">• ${r.date}</span>
          </div>
          <p class="text-text-secondary">${r.text}</p>
        </div>
      `).join('')
    : `<p class="text-text-secondary">No reviews yet.</p>`;

  document.getElementById('book-modal').classList.remove('hidden');
}

function closeBookModal() {
  document.getElementById('book-modal').classList.add('hidden');
}

function switchTab(tabId) {
  document.querySelectorAll('#book-modal .tab-content').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(`${tabId}-tab`).classList.remove('hidden');
  document.querySelectorAll('#book-modal .tab-button').forEach(btn => btn.classList.remove('active', 'text-accent', 'border-accent'));
  document.querySelector(`#book-modal .tab-button[onclick="switchTab('${tabId}')"]`).classList.add('active', 'text-accent', 'border-accent');
}

// Hook Preview Buttons After DOM Loads
document.addEventListener('DOMContentLoaded', async () => {
  await fetchBookData();
  // Attach listeners to all preview buttons (works even for dynamically generated cards)
  document.addEventListener('click', e => {
    if (e.target.closest('.preview-button')) {
      const slug = e.target.closest('.preview-button').dataset.slug;
      openBookModal(slug);
    }
  });
});

