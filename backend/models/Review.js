// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productSlug: String,
  rating: Number,
  comment: String,
  userName: String,
  // Add other necessary fields
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
