import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (slug) {
      // Directly navigate to the specific game using the entered slug
      navigate(`/product/${slug}`);
    } else {
      
    }
  };

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="slug"
          id="slug"
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Enter Game Name..."
          aria-label="Search Game by Slug"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant="outline-primary" type="submit" id="button-search">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
}
