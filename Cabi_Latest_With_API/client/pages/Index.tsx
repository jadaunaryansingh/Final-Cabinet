import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import RideCategories from '../components/RideCategories';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';
import FloatingChatbot from '../components/FloatingChatbot';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <RideCategories />
      <MapSection />
      <Footer />
      <FloatingChatbot />
    </div>
  );
}
