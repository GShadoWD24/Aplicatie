// CartScreen.js

import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems } } = state;

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: { slug: item.slug } });
  };    

  return (
    <div>
      <Helmet>
        <title>Favourites</title>
      </Helmet>
      <h1>Favourites</h1>
      <ListGroup>
        {!cartItems || cartItems.length === 0 ? (
          <ListGroup.Item>
            <MessageBox>
              Favourites is empty. <Link to="/">Go back to Home Page</Link>
            </MessageBox>
          </ListGroup.Item>
        ) : (
          cartItems.map((item) => (
            <ListGroup.Item key={item.slug}>
              <Row className="align-items-center">
                <Col md={2}>
                  <img
                    src={item.background_image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                </Col>
                <Col md={4}>
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </Col>
                {/* Include any other information you want to display */}
                <Col md={3}>{/* Additional information */}</Col>
                <Col md={2}>
                <Button
                  onClick={() => removeItemHandler(item)}
                  variant="light"
                >
                  <i className="fas fa-trash"></i>
                </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
      <Card style={{ marginTop: '20px' }}>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <div className="d-grid">
                <Link to="/HomeScreen">
                  <Button
                    type="button"
                    variant="primary"
                    disabled={!cartItems || cartItems.length === 0}
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
