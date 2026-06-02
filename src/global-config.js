import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: 'Mova Flow',
  appVersion: packageJson.version,
  contactApiUrl: import.meta.env.VITE_CONTACT_API_URL ?? '',
};
