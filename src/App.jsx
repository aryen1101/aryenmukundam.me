import Nav from './components/Nav.jsx';
import SmoothScroll from './motion/SmoothScroll.jsx';
import FlightSystem from './motion/FlightSystem.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Work from './sections/Work.jsx';
import Stack from './sections/Stack.jsx';
import Experience from './sections/Experience.jsx';
import Education from './sections/Education.jsx';
import Practice from './sections/Practice.jsx';
import Contact from './sections/Contact.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      <Nav />
      <main id="main" className="page" tabIndex={-1}>
        <FlightSystem />
        <Hero />
        <About />
        <Work />
        <Stack />
        <Experience />
        <Education />
        <Practice />
        <Contact />
      </main>
    </>
  );
}
