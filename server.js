import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serves frontend

// File paths
const reviewsPath = path.join(process.cwd(), "json", "reviews.json");

// Utility: Read JSON file
const readReviews = () => {
  try {
    const data = fs.readFileSync(reviewsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading reviews.json:", error);
    return [];
  }
};

// Utility: Write JSON file
const writeReviews = (reviews) => {
  try {
    fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error("Error writing reviews.json:", error);
  }
};

// GET all reviews
app.get("/api/reviews", (req, res) => {
  res.json(readReviews());
});

// POST new review
app.post("/api/reviews", (req, res) => {
  const { book, user, rating, comment } = req.body;
  if (!book || !user || !rating || !comment) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const reviews = readReviews();
  const newReview = {
    id: Date.now(),
    book,
    user,
    rating,
    comment,
    helpful: 0,
    timestamp: new Date().toISOString(),
  };

  reviews.unshift(newReview);
  writeReviews(reviews);

  res.status(201).json(newReview);
});

// PUT to mark review as helpful
app.put("/api/reviews/:id/helpful", (req, res) => {
  const { id } = req.params;
  const reviews = readReviews();
  const review = reviews.find((r) => r.id === Number(id));

  if (!review) {
    return res.status(404).json({ error: "Review not found." });
  }

  review.helpful += 1;
  writeReviews(reviews);
  res.json(review);
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
