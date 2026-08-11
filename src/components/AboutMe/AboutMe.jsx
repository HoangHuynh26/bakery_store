import './AboutMe.css';

function AboutMe() {
  return (
    <section className="about-me section-shell">
      <div className="section-heading">
        <span className="section-kicker">About Me</span>
        <h2>Building better web experiences.</h2>
      </div>

      <div className="about-me-copy">
        <p>
          I am an Information Technology student with a strong interest in full-stack web development.
        </p>
        <p>
          I enjoy building modern web applications and learning technologies such as React, Node.js,
          Express, and PostgreSQL.
        </p>
        <p>
          I focus on creating clean, practical, and user-friendly applications while continuously improving
          my software development skills.
        </p>
      </div>
    </section>
  );
}

export default AboutMe;
