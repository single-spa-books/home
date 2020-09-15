import React, { useRef } from "react";
import { navigateToUrl } from "single-spa";

import "./home.component.css";

export default function Root() {
  const ref = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    const { value } = ref.current;

    navigateToUrl("/books?q=" + value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="home">
        <label className="home__label" htmlFor="book-search-input">
          Type a Google Books search
        </label>

        <input ref={ref} className="home__input" id="book-search-input" />

        <button type="submit" className="home__button">
          Book Search
        </button>
      </div>
    </form>
  );
}
