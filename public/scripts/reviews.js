let reviews = [];
let books = []; // will be loaded from books.json
let selectedRating = 0;

// Fetch reviews + books on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // ✅ Fetch reviews from backend API
    const reviewsRes = await fetch("/api/reviews");
    reviews = await reviewsRes.json();

    // ✅ Fetch books from local file
    const booksRes = await fetch("../json/books.json");
    books = await booksRes.json();

    populateBookDropdown();
    renderReviews();
  } catch (error) {
    console.error("Failed to load reviews/books:", error);
  }
});


// Render reviews dynamically
function renderReviews() {
  const container = document.getElementById("reviews-grid");
  container.innerHTML = "";

  reviews.forEach(review => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl p-6 literary-shadow hover:literary-shadow-prominent literary-transition";

    card.innerHTML = `
      <div class="flex items-center space-x-3 mb-4">
        <img src="${review.user.avatar}" alt="${review.user.name}" class="w-10 h-10 rounded-full object-cover" />
        <div>
          <div class="font-cta font-medium text-primary">${review.user.name}</div>
          <div class="flex text-accent">
            ${renderStars(review.rating)}
          </div>
        </div>
      </div>
      <h4 class="font-display font-bold text-primary mb-2">${review.book}</h4>
      <p class="text-text-secondary mb-4">${review.comment}</p>
      <div class="flex items-center justify-between text-sm text-text-secondary">
        <span>${timeAgo(new Date(review.timestamp))}</span>
        <div class="flex items-center space-x-4">
          <span>${review.helpful} helpful</span>
          <button onclick="markHelpful(${review.id})" class="text-accent hover:text-accent-700 literary-transition">Helpful</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render stars dynamically
function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<svg class="w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>`
  ).join("");
}

// Mark review as helpful
async function markHelpful(id) {
  try {
    const res = await fetch(`/api/reviews/${id}/helpful`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("Failed to mark as helpful");

    const updatedReview = await res.json();

    // Update in-memory array & re-render
    const idx = reviews.findIndex(r => r.id === updatedReview.id);
    if (idx !== -1) reviews[idx] = updatedReview;
    renderReviews();
  } catch (error) {
    console.error("Error marking helpful:", error);
    alert("Could not mark review as helpful.");
  }
}


// Populate book dropdown
function populateBookDropdown() {
  console.log("Books array:", books); // ✅ Check what's inside
  const select = document.getElementById("review-book");
  if (!select) {
    console.error("Dropdown element not found!");
    return;
  }
  select.innerHTML = books.map(b => `<option value="${b.title}">${b.title}</option>`).join("");
}


// Modal controls
function openReviewModal() {
  const modal = document.getElementById("review-modal");
  if (!modal) {
    console.error("Review modal not found.");
    return;
  }
  modal.classList.remove("hidden");
  renderRatingStars();
}


function closeReviewModal() {
  document.getElementById("review-modal").classList.add("hidden");
}

// Render rating stars for modal
function renderRatingStars() {
  const container = document.getElementById("rating-stars");
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = `<svg class="w-6 h-6 cursor-pointer ${i <= selectedRating ? 'text-accent' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
    </svg>`;
    star.onclick = () => {
      selectedRating = i;
      renderRatingStars();
    };
    container.appendChild(star);
  }
}

// Submit review
async function submitReview() {
  const book = document.getElementById("review-book").value;
  const comment = document.getElementById("review-comment").value;

  if (!comment.trim() || selectedRating === 0) {
    alert("Please provide a rating and comment.");
    return;
  }

  const newReview = {
    book,
    user: {
      name: "Anonymous User", // replace with real user name if auth available
      avatar: "https://www.gravatar.com/avatar/?d=mp"
    },
    rating: selectedRating,
    comment
  };

  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview)
    });

    if (!res.ok) {
      console.error("Failed to submit review:", await res.text());
      alert("Failed to submit review. Please try again.");
      return;
    }

    const savedReview = await res.json();
    reviews.unshift(savedReview); // add to local array
    renderReviews();

    // Reset modal state
    closeReviewModal();
    document.getElementById("review-comment").value = "";
    selectedRating = 0;
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("An error occurred. Please try again.");
  }
}


// Utility: Time ago
function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
