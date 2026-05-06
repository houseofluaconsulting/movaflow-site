import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Mova Flow — Lead Distribution Platform',
  description:
    'Mova Flow is a lead distribution platform connecting lead-generation teams with buyers. Manage leads, track metrics, and reward growth — all in one place.',
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />

      <HomeView />
    </>
  );
}
