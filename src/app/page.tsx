import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import LatestEntrepreneurs from '@/components/LatestEntrepreneurs';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CategoryGrid />
        <LatestEntrepreneurs />
      </main>
      <Footer />
    </div>
  );
}
