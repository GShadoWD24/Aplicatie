import { useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const API_KEY = 'cabf53fd8287462d8ea4cfce5131d226';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false }; // Add 'products' property
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [], // Add 'products' property
    loading: true,
    error: '',
  });


  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // Fetching platforms data
        const platformsResponse = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`);

        // Fetching games data for the specified dates and platforms
        const gamesResponse = await axios.get(
          `https://api.rawg.io/api/games?key=${API_KEY}&dates=2019-09-01,2019-09-30&platforms=18,1,7`
        );

        // Combine or process the data as needed
        const combinedData = {
          platforms: platformsResponse.data.results,
          games: gamesResponse.data.results,
        };

        dispatch({ type: 'FETCH_SUCCESS', payload: combinedData });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };

    fetchData();
  }, []);

	return (
    <div>
      <Helmet>
        <title>Critiquo</title>
      </Helmet>
      <h1>All Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.games.map((game) => (
              <Col key={game.id} sm={6} md={4} lg={3} className="mb-3">
                <Product product={game} />
                {/* Display other details here */}
                <img
                  src={game.background_image}
                  alt={game.name}
                  style={{ maxWidth: '100%', height: '0px', objectFit: 'cover' }}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}


export default HomeScreen;
