import './Highlights.css';

function Highlights() {
  const highlights = [
    {
      title: 'Fresh Every Day',
      description: 'Bakes are prepared daily for a lively, fragrant bakery counter.'
    },
    {
      title: 'Quality Ingredients',
      description: 'We select carefully sourced ingredients for balanced flavor.'
    },
    {
      title: 'Handmade With Care',
      description: 'Every loaf and pastry is shaped, finished, and checked by hand.'
    },
    {
      title: 'Friendly Service',
      description: 'Our bakery team is ready to help you find your next favorite bake.'
    }
  ];

  return (
    <section className="highlights section-shell">
      <div className="section-heading">
        <span className="section-kicker">Bakery Highlights</span>
        <h2>Simple standards, beautiful results.</h2>
      </div>

      <div className="highlight-grid">
        {highlights.map((highlight) => (
          <article className="highlight-card" key={highlight.title}>
            <span className="highlight-icon" aria-hidden="true">✓</span>
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Highlights;
