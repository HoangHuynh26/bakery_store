import './WhyChooseUs.css';

function WhyChooseUs() {
  return (
    <section className="why section-shell">
      <div className="section-heading centered-heading">
        <span className="section-kicker">Why Choose Us</span>
        <h2>Fresh • Handmade • Quality</h2>
      </div>

      <div className="why-grid">
        <article className="why-card">
          <span className="why-icon" aria-hidden="true">☀</span>
          <div>
            <h3>Made for fresh mornings</h3>
            <p>Our breads and pastries are baked daily to bring soft texture and aroma to your table.</p>
          </div>
        </article>
        <article className="why-card">
          <span className="why-icon" aria-hidden="true">♥</span>
          <div>
            <h3>Care in every detail</h3>
            <p>We honor simple methods, genuine ingredients, and a finish that makes each bake feel warm.</p>
          </div>
        </article>
        <article className="why-card">
          <span className="why-icon" aria-hidden="true">✦</span>
          <div>
            <h3>Support your local bakery</h3>
            <p>Small-batch baking keeps our kitchen close to the community we serve.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default WhyChooseUs;
