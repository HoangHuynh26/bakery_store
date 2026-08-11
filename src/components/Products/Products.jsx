import './Products.css';

function Products() {
  const products = [
    {
      name: 'Butter Croissant',
      description: 'Layered, flaky, and finished with a golden crisp outside.',
      price: '$3.50',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80',
      alt: 'Buttery croissant served on a bakery tray'
    },
    {
      name: 'Sourdough Bread',
      description: 'A rustic loaf with a crisp crust and deep, delicate tang.',
      price: '$7.00',
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80',
      alt: 'Fresh sourdough bread loaf on a rustic surface'
    },
    {
      name: 'Chocolate Cake',
      description: 'Rich cocoa layers finished with a silky smooth ganache.',
      price: '$28.00',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80',
      alt: 'Chocolate cake with a glossy finish'
    }
  ];

  return (
    <section className="products section-shell" id="products">
      <div className="section-heading product-heading">
        <span className="section-kicker">Featured Products</span>
        <h2>Warm favorites from our bakery.</h2>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.name}>
            <img
              className="product-image"
              src={product.image}
              alt={product.alt}
              loading="lazy"
            />
            <div className="product-content">
              <div className="product-top">
                <h3>{product.name}</h3>
                <span className="price">{product.price}</span>
              </div>
              <p>{product.description}</p>
              <a className="btn btn-outline" href="#contact">
                Order {product.name}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Products;
