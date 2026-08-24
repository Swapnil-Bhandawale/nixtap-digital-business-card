import React from 'react';
import Navbar from './landing/components/layout/Navbar';
import Footer from './landing/components/layout/Footer';
import Hero from './landing/sections/Hero';
import TrustBar from './landing/sections/TrustBar';
import PainPoints from './landing/sections/PainPoints';
import ConnectionBanner from './landing/sections/ConnectionBanner';
import HowItWorks from './landing/sections/HowItWorks';
import ProductShowcase from './landing/sections/ProductShowcase';
import FeatureShowcase from './landing/sections/FeatureShowcase';
import ShareMethods from './landing/sections/ShareMethods';
import TemplateGallery from './landing/sections/TemplateGallery';
import AnalyticsSection from './landing/sections/AnalyticsSection';
import Comparison from './landing/sections/Comparison';
import Testimonials from './landing/sections/Testimonials';
import Pricing from './landing/sections/Pricing';
import FAQ from './landing/sections/FAQ';
import Blog from './landing/sections/Blog';
import FinalCTA from './landing/sections/FinalCTA';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <PainPoints />
        <ConnectionBanner />
        <HowItWorks />
        <ProductShowcase />
        <FeatureShowcase />
        <ShareMethods />
        <TemplateGallery />
        <AnalyticsSection />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Blog />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
