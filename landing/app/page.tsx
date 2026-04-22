import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import StudentCallout from "@/components/StudentCallout";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <StatsSection />
      <FeaturesSection />
      <div className="py-20">
        <StudentCallout />
      </div>
      <CtaSection />
      <Footer />
    </main>
  );
}
