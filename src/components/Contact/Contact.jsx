import './Contact.css';

function Contact() {
  return (
    <section className="contact section-shell" id="contact">
      <div className="section-heading">
        <span className="section-kicker">Contact</span>
        <h2>Visit our bakery or send a message.</h2>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>Connect with us</h3>
          <p>
            Email: <a href="mailto:your-email@example.com">your-email@example.com</a>
          </p>
          <a className="btn btn-primary" href="mailto:your-email@example.com">
            Contact Us
          </a>
        </div>
        <div className="contact-card muted-card">
          <h3>Bakery Hours</h3>
          <p>Monday - Saturday</p>
          <p>8:00 AM - 6:00 PM</p>
          <p>Closed Sundays</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
