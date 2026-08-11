import './SalesNumbers.css';

function SalesNumbers() {
  return (
    <section className="sales section-shell">
      <div className="section-heading centered-heading">
        <span className="section-kicker">Our Numbers</span>
        <h2>Every loaf has a story behind it.</h2>
      </div>

      <div className="sales-grid">
        <article className="sales-item">
          <span className="sales-number">10,000+</span>
          <span className="sales-label">Products Sold</span>
        </article>
        <article className="sales-item">
          <span className="sales-number">2,500+</span>
          <span className="sales-label">Happy Customers</span>
        </article>
      </div>
    </section>
  );
}

export default SalesNumbers;
