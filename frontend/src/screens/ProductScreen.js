import React, { useReducer, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const Rating = ({ rating, caption }) => {
  // ... (previous code)
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false, product: action.payload };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    default:
      return state;
  }
};

function ProductScreen() {
  const [
    { loading, error, product},
    dispatch,
  ] = useReducer(reducer, {
    product: {},
    loading: true,
    error: '',
    loadingCreateReview: false,
  });

  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });

      try {
        const [gameResponse, reviewsResponse, detailsResponse] = await Promise.all([
          fetch(`https://api.rawg.io/api/games/${slug}?key=cabf53fd8287462d8ea4cfce5131d226`),
          fetch(`https://api.rawg.io/api/games/${slug}/reviews?key=cabf53fd8287462d8ea4cfce5131d226`),
          fetch(`https://api.rawg.io/api/games/${slug}?key=cabf53fd8287462d8ea4cfce5131d226`),
        ]);

        const [gameData, reviewsData, detailsData] = await Promise.all([
          gameResponse.json(),
          reviewsResponse.json(),
          detailsResponse.json(),
        ]);

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

  const {dispatch: ctxDispatch } = useContext(Store);

  const addToCartHandler = async () => {
    try {
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: {
          slug: product.slug,
          name: product.name,
          background_image: product.image,
          quantity: 1,
        },
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
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
            <Button onClick={() => addToCartHandler(product)}>
              Add to Favourites
            </Button>
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
              <Rating rating={product.rating} caption="" />
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Description:</strong>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
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
                    <div dangerouslySetInnerHTML={{ __html: review.text }} />
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>
                  <MessageBox>
                    There are no reviews for this product.
                  </MessageBox>
                </ListGroup.Item>
              )}
            </ListGroup>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
