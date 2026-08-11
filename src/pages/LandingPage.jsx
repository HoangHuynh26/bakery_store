import Navbar from '../components/Navbar/Navbar.jsx';
import Hero from '../components/Hero/Hero.jsx';
import About from '../components/About/About.jsx';
import Highlights from '../components/Highlights/Highlights.jsx';
import Products from '../components/Products/Products.jsx';
import CTA from '../components/CTA/CTA.jsx';
import CustomerReviews from '../components/CustomerReviews/CustomerReviews.jsx';
import SalesNumbers from '../components/SalesNumbers/SalesNumbers.jsx';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs.jsx';
import Contact from '../components/Contact/Contact.jsx';
import AboutMe from '../components/AboutMe/AboutMe.jsx';
import Farewell from '../components/Farewell/Farewell.jsx';
import Footer from '../components/Footer/Footer.jsx';

function LandingPage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Hero />
        <About />
        <Highlights />
        <Products />
        <CTA
          kicker="Our Favorite Bakes"
          title="See what our bakery is serving this week."
          body="From breakfast pastries to celebration cakes, our counter is stocked with fresh favorites."
          buttonText="View Products"
          href="#products"
        />
        <CustomerReviews />
        <CTA
          kicker="Product Details"
          title="See what makes each bake special."
          body="Explore the texture, ingredients, and finishing details behind our warmest bakery classics."
          buttonText="See Details"
          href="#products"
        />
        <SalesNumbers />
        <WhyChooseUs />
        <CTA
          kicker="Let’s Bake Together"
          title="Bring home your next favorite treat."
          body="Plan your next bakery visit, order a celebration cake, or ask about today’s fresh table."
          buttonText="Contact"
          href="#contact"
        />
        <Contact />
        <AboutMe />
        <Farewell />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
