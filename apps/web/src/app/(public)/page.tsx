import PremiumHero from '@/components/hero/PremiumHero';
import StatsSection from '@/components/home/StatsSection';
import MapSection from '@/components/home/MapSection';
import CountriesSection from '@/components/home/CountriesSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import PackagesSection from '@/components/home/PackagesSection';
import SuccessStoriesSection from '@/components/home/SuccessStoriesSection';
import FAQSection from '@/components/home/FAQSection';
import OfficesSection from '@/components/home/OfficesSection';
import PartnersSection from '@/components/home/PartnersSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-charcoal">
      <PremiumHero />
      <StatsSection />
      <MapSection />
      <CountriesSection />
      <ProgramsSection />
      <PackagesSection />
      <SuccessStoriesSection />
      <FAQSection />
      <OfficesSection />
      <PartnersSection />
      <CTASection />
    </div>
  );
}