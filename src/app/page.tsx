import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import PainPoints from "./components/landing/PainPoints";
import HowItWorks from "./components/landing/HowItWorks";
import ProductDemo from "./components/landing/ProductDemo";
import BentoFeatures from "./components/landing/BentoFeatures";
import UseCases from "./components/landing/UseCases";
import Comparison from "./components/landing/Comparison";
import Testimonials from "./components/landing/Testimonials";
import Faq from "./components/landing/Faq";
import CtaFooter from "./components/landing/CtaFooter";

export default function Home() {
  return (
    <main className="flex flex-col relative overflow-hidden">
      <Navbar />
      <Hero />
      <PainPoints />
      <HowItWorks />
      <ProductDemo />
      <Testimonials />
      <BentoFeatures />
      <UseCases />
      <Comparison />
      <Faq />
      <CtaFooter />
    </main>
  );
}
