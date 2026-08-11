import './About.css';

function About() {
  return (
    <section className="about section-shell" id="about">
      <div className="section-heading">
        <span className="section-kicker">Our Story</span>
        <h2>Small batches, honest flavor.</h2>
      </div>

      <div className="about-grid">
        <div className="about-copy">
          <p>
            We believe great baking starts with simple ingredients,
            careful preparation, and a genuine passion for quality.
          </p>
          <p>
            Every loaf, pastry, and cake is shaped by our bakery team to
            bring warmth and comfort to your everyday table.
          </p>
        </div>

        <aside className="about-card">
          <div className="about-card-icon" aria-hidden="true">
            ✨
          </div>
          <div>
            <h3>Fresh from the oven</h3>
            <p>
              Our kitchen prepares each bake in hand-finished batches,
              so every order feels thoughtful and made for the moment.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default About;
