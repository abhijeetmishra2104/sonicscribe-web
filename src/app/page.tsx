import React from "react";
import { HeroSection } from "@/components/Herosection";
import { TopBar } from "@/components/Topbar";
import { FeatureCards } from "@/components/FeatureCard";
import { TestimonialSection } from "@/components/TestimonialSection";
import  Contact  from "@/components/Contact";
import  PricingSection  from "@/components/PricingSection";
import  Footer  from "@/components/Footer";


export default function Home() {
  return (
      <div className="w-full h-full m-0 p-0">
        <TopBar />
        <HeroSection />
        <FeatureCards />
        <PricingSection />
        <Contact />
        <TestimonialSection />
        <Footer />
      </div>
    
  );
}
