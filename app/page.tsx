import Header from "@/components/sites/bytecap/Header";
import Hero from "@/components/sites/bytecap/Hero";
import TrustedBy from "@/components/sites/bytecap/TrustedBy";
import FindMoments from "@/components/sites/bytecap/FindMoments";
import SpeakersInFrame from "@/components/sites/bytecap/SpeakersInFrame";
import WorksOnFootage from "@/components/sites/bytecap/WorksOnFootage";
import PromptClipping from "@/components/sites/bytecap/PromptClipping";
import MomentIntelligence from "@/components/sites/bytecap/MomentIntelligence";
import HowItWorks from "@/components/sites/bytecap/HowItWorks";
import OneEditEverywhere from "@/components/sites/bytecap/OneEditEverywhere";
import VideoEditor from "@/components/sites/bytecap/VideoEditor";
import Testimonials from "@/components/sites/bytecap/Testimonials";
import FAQ from "@/components/sites/bytecap/FAQ";
import Footer from "@/components/sites/bytecap/Footer";

export default function Home() {
  return (
    <div className="bc-main-bg-market flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <FindMoments />
        <SpeakersInFrame />
        <WorksOnFootage />
        <PromptClipping />
        <MomentIntelligence />
        <HowItWorks />
        <OneEditEverywhere />
        <VideoEditor />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
