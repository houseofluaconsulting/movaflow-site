import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { BackToTopButton } from 'src/components/animate/back-to-top-button';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeCTA } from '../home-cta';
import { HomeHero } from '../home-hero';
import { HomeContact } from '../home-contact';
import { HomeFeatures } from '../home-features';
import { HomeTechnology } from '../home-technology';
import { HomeHowItWorks } from '../home-how-it-works';
import { HomeCRMIntegrations } from '../home-crm-integrations';

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();
  const { hash } = useLocation();

  useEffect(() => {
    const target = hash?.slice(1);
    if (!target) return undefined;
    // Defer so the target element exists after the section renders.
    const id = window.requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(id);
  }, [hash]);

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1 })]}
      />

      <BackToTopButton />

      <HomeHero />
      <HomeFeatures />
      <HomeHowItWorks />
      <HomeCRMIntegrations />
      <HomeCTA />
      <HomeTechnology />
      <HomeContact />
    </>
  );
}
