import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <a className="footer-brand" href="#home">Bakery Store</a>
          <p className="footer-email">your-email@example.com</p>
        </div>
        <div>
          <span className="footer-title">Explore</span>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-copy">
          <span>© 2026 Bakery Store. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
