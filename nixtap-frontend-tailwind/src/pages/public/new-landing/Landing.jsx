import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HeroSection from "./sections/hero-section";
import WhatWeDoSection from "./sections/what-we-do-section";
import HowItWorksSection from "./sections/how-it-works-section";
import OurLatestCreations from "./sections/our-latest-creations";
import PricingSection from "./sections/pricing-section";
import OurTestimonialSection from "./sections/our-testimonials-section";
import FaqSection from "./sections/faq-section";
import CtaSection from "./sections/cta-section";

export default function Landing() {
    return (
        <div className="bg-white text-gray-900 font-sans antialiased selection:bg-indigo-200">
            <Navbar />
            <main className='px-4'>
                <HeroSection />
                <WhatWeDoSection />
                <HowItWorksSection />
                <OurLatestCreations />
                <PricingSection />
                <OurTestimonialSection />
                <FaqSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    );
}
