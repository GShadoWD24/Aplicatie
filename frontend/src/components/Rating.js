import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RatingContainer({ slug }) {
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomRating, setRandomRating] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.rawg.io/api/games/${slug}?key=cabf53fd8287462d8ea4cfce5131d226`
        );

        console.log('RAWG API response:', response);

        const { rating, ratings_count: reviewCount } = response.data;

        if (rating !== null && typeof rating === 'number') {
          setRating(rating);
          setReviewCount(reviewCount || 0); // Set review count to 0 if it's not provided
          setLoading(false);
        } else {
          setRating(0);
          setReviewCount(0);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
        setError('Error fetching rating data.');
        setLoading(false);
      }
    };

    if (randomRating === null) {
      // Generate a random number between 1 and 100 only once
      setRandomRating(Math.floor(Math.random() * 5) + 1);
    }

    fetchData();
  }, [slug, randomRating]);

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Error fetching rating: {error}</div>
  ) : (
    <div>
      <strong>Rating:</strong> {randomRating}
    </div>
  );
}

export default RatingContainer;
