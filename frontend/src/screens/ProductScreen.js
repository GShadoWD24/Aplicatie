import axios from 'axios';
import { useEffect, useReducer, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import RatingContainer from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { useContext } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    default:
      return state;
    case 'ADD_TO_FAVORITES':
      const newItem = action.payload;
      return {
        ...state,
        favorites: [...state.favorites, newItem],
      };
  }
};

function ProductScreen() {
  const [
    { loading, error, product, loadingCreateReview },
    dispatch,
  ] = useReducer(reducer, {
    product: {},
    loading: true,
    error: '',
    loadingCreateReview: false,
  });

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });

      try {
        // Fetching data from the RAWG API for the specific game using the slug
        const gameResponse = await fetch(
          `https://api.rawg.io/api/games/${slug}?key=cabf53fd8287462d8ea4cfce5131d226`
        );
        const gameData = await gameResponse.json();

        // Fetching reviews for the specific game using the game's ID
        const reviewsResponse = await fetch(
          `https://api.rawg.io/api/games/${gameData.id}/reviews?key=cabf53fd8287462d8ea4cfce5131d226`
        );
        const reviewsData = await reviewsResponse.json();

        // Fetching additional details, including the image, for the specific game
        const detailsResponse = await fetch(
          `https://api.rawg.io/api/games/${gameData.id}?key=cabf53fd8287462d8ea4cfce5131d226`
        );
        const detailsData = await detailsResponse.json();

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            name: gameData.name,
            rating: gameData.rating,
            reviews: reviewsData.results,
            image: detailsData.background_image,
            description: gameData.description,
          },
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [slug]);

  let reviewsRef = useRef();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const addToCartHandler = async () => {
    try {
  
      // If the item doesn't exist in the cart, add it
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: {
          slug: product.slug,
          name: product.name,
          background_image: product.image,
          quantity: 1,
        },
      });
  
      toast.success('Added to Cart!');
    } catch (error) {
      // Handle the error, e.g., show a toast or log the error
      console.error('Error adding to cart:', error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product.slug}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      // Fetch updated product data after review submission
      const updatedProductResponse = await fetch(
        `https://api.rawg.io/api/games/${product.slug}?key=cabf53fd8287462d8ea4cfce5131d226`
      );
      const updatedProductData = await updatedProductResponse.json();

      dispatch({
        type: 'REFRESH_PRODUCT',
        payload: {
          ...product,
          reviews: updatedProductData.results,
          numReviews: updatedProductData.numReviews,
          rating: updatedProductData.rating,
        },
      });

      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={5}>
          <img
            className="img-small"
            src={product.image}
            alt={product.name}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="my-3">
            <Button onClick={() => addToCartHandler(product)}>Add to Favourites</Button>
          </div>
        </Col>
        <Col md={7}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <RatingContainer slug={product.slug} />
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <div className="my-3">
        <h2 ref={reviewsRef}>Reviews</h2>
        <div className="mb-3">
          {product.reviews && product.reviews.length === 0 ? (
            <MessageBox>There is no review</MessageBox>
          ) : (
            <ListGroup>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <ListGroup.Item key={review.id}>
                    <strong>{review.user && review.user.username}</strong>
                    <Rating rating={review.rating} caption=" "></Rating>
                    <p>{review.created}</p>
                    <p>{review.text}</p>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>
                  <MessageBox>There are no reviews for this product.</MessageBox>
                </ListGroup.Item>
              )}
            </ListGroup>
          )}
        </div>
        <div className="my-3">
          {userInfo ? (
            <div className="my-3">
              <form onSubmit={submitHandler}>
                <h2>Write a customer review</h2>
                <Form.Group className="mb-3" controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    aria-label="Rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1">1- Poor</option>
                    <option value="2">2- Fair</option>
                    <option value="3">3- Good</option>
                    <option value="4">4- Very good</option>
                    <option value="5">5- Excellent</option>
                  </Form.Select>
                </Form.Group>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Comments"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </FloatingLabel>

                <div className="mb-3">
                  <Button disabled={loadingCreateReview} type="submit">
                    Submit
                  </Button>
                  {loadingCreateReview && <LoadingBox></LoadingBox>}
                </div>
              </form>
            </div>
          ) : (
            <MessageBox>
              Please{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
