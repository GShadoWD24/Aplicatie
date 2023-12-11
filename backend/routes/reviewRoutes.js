// routes/reviewRoutes.js
import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/:productSlug/reviews', async (req, res) => {
  const { rating, comment, name } = req.body;
  const { productSlug } = req.params;

  try {
    const product = await Product.findOne({ slug: productSlug });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create a new review
    const review = new Review({
      rating,
      comment,
      name,
      productSlug: product.slug,
    });

    // Save the review to the database
    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error saving review to MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
