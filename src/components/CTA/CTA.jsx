import './CTA.css';

function CTA({
  kicker = 'The Bakery Table',
  title = 'Bring a little warmth home.',
  body = 'Visit our bakery counter for fresh loaves, pastries, and celebration cakes.',
  buttonText = 'Explore Our Bakery',
  href = '#products'
}) {
  return (
    <section className="cta-outro">
      <div className="cta-panel">
        <div>
          <span className="section-kicker">{kicker}</span>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <div className="cta-actions">
          <a className="btn btn-primary" href={href}>
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
