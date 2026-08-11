import './CustomerReviews.css';

function CustomerReviews() {
  const reviews = [
    {
      quote: 'Amazing taste, beautiful texture, and a warm finish that felt homemade.',
      name: 'Linh P.'
    },
    {
      quote: 'Fresh and delicious every morning. The croissants are always a treat.',
      name: 'Minh T.'
    }
  ];

  return (
    <section className="reviews section-shell">
      <div className="section-heading centered-heading">
        <span className="section-kicker">What Customers Say</span>
        <h2>Our bakery is part of the daily ritual.</h2>
      </div>

      <div className="reviews-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.name}>
            <div className="stars" aria-label="Five star review">
              <span aria-hidden="true">★★★★★</span>
            </div>
            <p className="review-quote">“{review.quote}”</p>
            <span className="review-author">{review.name}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CustomerReviews;
