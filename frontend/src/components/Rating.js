import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Rating(props) {
  const { rating, numReviews } = props;

  if (!rating) {
    // Loading state or handle errors
    return <div>Loading...</div>;
  }

  return (
    <div className="rating">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          <i
            className={
              rating >= index + 1
                ? 'fas fa-star'
                : rating >= index + 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          />
        </span>
      ))}
      <span>{' ' + numReviews + ' reviews'}</span>
    </div>
  );
}

function RatingContainer({ slug }) {
  const [ratingData, setRatingData] = useState({
    rating: 0,
    numReviews: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.rawg.io/api/games/${slug}?key=cabf53fd8287462d8ea4cfce5131d226`
        );

        const { rating, ratings_count: numReviews } = response.data;

        setRatingData({
          rating: rating || 0,
          numReviews: numReviews || 0,
        });
      } catch (error) {
        console.error('Error fetching rating:', error);
        // Set default data in case of an error
        setRatingData({ rating: 0, numReviews: 0 });
      }
    };

    fetchData();
  }, [slug]);

  return <Rating {...ratingData} />;
}

export default RatingContainer;
