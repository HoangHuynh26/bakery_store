import './Hero.css';

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <div className="eyebrow">Slow Bakes. Honest Ingredients.</div>
        <h1>Freshly Baked, Made With Love.</h1>
        <p className="hero-description">
          Discover handcrafted breads, pastries, and cakes made fresh
          with carefully selected ingredients.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#about">
            Explore Our Bakery
          </a>
          <a className="btn btn-secondary" href="#products">
            View Products
          </a>
        </div>
      </div>

      <div className="hero-image-panel">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80"
          alt="Fresh artisan bread and bakery goods on a table"
        />
      </div>
    </section>
  );
}

export default Hero;
