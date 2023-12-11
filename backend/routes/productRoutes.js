// productRouter.js
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAuth } from '../utils.js';

const productRouter = express.Router();

// ... (existing routes)

productRouter.post(
  '/:slug/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productSlug = req.params.slug;
    const product = await Product.findOne({ slug: productSlug });

    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res.status(400).send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;

      const updatedProduct = await product.save();

      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
