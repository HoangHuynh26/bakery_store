import './Navbar.css';

function Navbar() {
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Products', href: '#products' },
    { label: 'Contact', href: '#contact' }
  ];

  const toggleMenu = () => {
    const nav = document.querySelector('.navbar-links');
    const navButton = document.querySelector('.nav-toggle');

    if (!nav || !navButton) {
      return;
    }

    const isExpanded = navButton.getAttribute('aria-expanded') === 'true';
    navButton.setAttribute('aria-expanded', String(!isExpanded));
    nav.classList.toggle('is-open');
  };

  return (
    <nav className="navbar">
      <a className="brand" href="#home" aria-label="Bakery Store home">
        <span className="brand-icon" aria-hidden="true">✧</span>
        <span className="brand-text">Bakery Store</span>
      </a>

      <button
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded="false"
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="navbar-links">
        <ul className="nav-menu">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <a className="nav-cta" href="#contact">
          Explore Our Bakery
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
