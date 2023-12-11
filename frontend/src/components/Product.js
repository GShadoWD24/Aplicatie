// Product.js

import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    try {
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: {
          slug: item.slug,
          name: item.name,
          background_image: item.background_image,
          quantity: 1,
        },
      });
    } catch (error) {
      // Handle the error, e.g., show a toast or log the error
      console.error('Error adding to cart:', error);
    }
  };
    
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.background_image}
          className="card-img-top"
          alt={product.name}
          style={{
            maxHeight: '200px',
            minHeight: '200px',
            width: '100%',
            height: '100%',
          }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link> 
        <Card.Text>{/* Add other product details as needed */}</Card.Text>
        <Button onClick={() => addToCartHandler(product)}>Add to Favourites</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
