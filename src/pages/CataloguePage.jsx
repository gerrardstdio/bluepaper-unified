import Header from "../components/catalogue/Header";
import Hero from "../components/catalogue/Hero";
import Templates from "../components/catalogue/Templates";
import Features from "../components/catalogue/Features";
import CTA from "../components/catalogue/CTA";
import Footer from "../components/catalogue/Footer";
import Trust from "../components/catalogue/Trust";

export default function CataloguePage() {
  return (
    <>
      <Header />
      <Hero />
      <Trust />
      <Templates />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
