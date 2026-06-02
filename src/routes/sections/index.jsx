import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));
const PrivacyPolicyPage = lazy(() => import('src/pages/privacy-policy'));
const TermsConditionsPage = lazy(() => import('src/pages/terms-conditions'));
const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection = [
  {
    path: '/',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: '/privacy-policy',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <PrivacyPolicyPage />
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: '/terms-conditions',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <TermsConditionsPage />
        </MainLayout>
      </Suspense>
    ),
  },

  // No match
  { path: '*', element: <Page404 /> },
];
