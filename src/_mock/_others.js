import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _carouselsMembers = Array.from({ length: 6 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  role: _mock.role(index),
  avatarUrl: _mock.image.portrait(index),
}));

// ----------------------------------------------------------------------

export const _faqs = Array.from({ length: 8 }, (_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  title: `Questions ${index + 1}`,
  content: _mock.description(index),
}));

// ----------------------------------------------------------------------

export const _addressBooks = Array.from({ length: 24 }, (_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  email: _mock.email(index + 1),
  fullAddress: _mock.fullAddress(index),
  phoneNumber: _mock.phoneNumber(index),
  company: _mock.companyNames(index + 1),
  addressType: index === 0 ? 'Home' : 'Office',
}));

// ----------------------------------------------------------------------

export const _contacts = Array.from({ length: 20 }, (_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'offline') || (index % 4 && 'always') || 'busy';

  return {
    id: _mock.id(index),
    status,
    role: _mock.role(index),
    email: _mock.email(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    avatarUrl: _mock.image.avatar(index),
    address: _mock.fullAddress(index),
  };
});

// ----------------------------------------------------------------------

export const _notifications = Array.from({ length: 9 }, (_, index) => ({
  id: _mock.id(index),
  avatarUrl: [
    _mock.image.avatar(1),
    _mock.image.avatar(2),
    _mock.image.avatar(3),
    _mock.image.avatar(4),
    _mock.image.avatar(5),
    null,
    null,
    null,
    null,
    null,
  ][index],
  type: ['friend', 'project', 'file', 'tags', 'payment', 'order', 'delivery', 'chat', 'mail'][
    index
  ],
  category: [
    'Communication',
    'Project UI',
    'File manager',
    'File manager',
    'File manager',
    'Order',
    'Order',
    'Communication',
    'Communication',
  ][index],
  isUnRead: _mock.boolean(index),
  createdAt: _mock.time(index),
  title:
    (index === 0 && `<p><strong>Deja Brady</strong> sent you a friend request</p>`) ||
    (index === 1 &&
      `<p><strong>Jayvon Hull</strong> mentioned you in <strong><a href='#'>Minimal UI</a></strong></p>`) ||
    (index === 2 &&
      `<p><strong>Lainey Davidson</strong> added file to <strong><a href='#'>File manager</a></strong></p>`) ||
    (index === 3 &&
      `<p><strong>Angelique Morse</strong> added new tags to <strong><a href='#'>File manager<a/></strong></p>`) ||
    (index === 4 &&
      `<p><strong>Giana Brandt</strong> request a payment of <strong>$200</strong></p>`) ||
    (index === 5 && `<p>Your order is placed waiting for shipping</p>`) ||
    (index === 6 && `<p>Delivery processing your order is being shipped</p>`) ||
    (index === 7 && `<p>You have new message 5 unread messages</p>`) ||
    (index === 8 && `<p>You have new mail`) ||
    '',
}));

// ----------------------------------------------------------------------

export const _mapContact = [
  { latlng: [33, 65], address: _mock.fullAddress(1), phoneNumber: _mock.phoneNumber(1) },
  { latlng: [-12.5, 18.5], address: _mock.fullAddress(2), phoneNumber: _mock.phoneNumber(2) },
];

// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    label: 'Facebook',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    label: 'Twitter',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];

// ----------------------------------------------------------------------

export const _veteranWebsitePricingPlans = [
  {
    credit: '20',
    opportunity: 'Fresh',
    type: 'Veteran Website Leads',
    price: 45,
    amount: '$900.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SyfNqGHAeFkU5hvTEbcTB2r',
  },
  {
    credit: '30',
    opportunity: 'Fresh',
    type: 'Veteran Website Leads',
    price: 42,
    amount: '$1260.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SyfQ5GHAeFkU5hvR4UVJfq9',
  },
  {
    credit: '40',
    opportunity: 'Fresh',
    type: 'Veteran Website Leads',
    price: 39,
    amount: '$1560.00',
    originalPrice: 41,
    originalAmount: '$1640.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TOLscGHAeFkU5hvKnmw1iXT',
  },
  {
    credit: '50',
    opportunity: 'Fresh',
    type: 'Veteran Website Leads',
    price: 36,
    amount: '$1800.00',
    originalPrice: 39,
    originalAmount: '$1950.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SPYPjGHAeFkU5hvZnxZ6Ifo',
  },
];

export const _veteranWebsiteMixedPricingPlans = [
  {
    credit: '20/30',
    opportunity: 'Mixed',
    type: 'Veteran Website Leads',
    description: '20 Fresh & 30 Aged',
    freshPrice: 40,
    agedPrice: 8,
    amount: '$1040.00',
    originalAmount: '$1110.00',
    originalFreshPrice: 42,
    originalAgedPrice: 9,
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TOM2QGHAeFkU5hvMKj8BytV',
  },
  {
    credit: '30/40',
    opportunity: 'Mixed',
    type: 'Veteran Website Leads',
    description: '30 Fresh & 40 Aged',
    freshPrice: 38,
    agedPrice: 8,
    amount: '$1460.00',
    originalAmount: '$1560.00',
    originalFreshPrice: 40,
    originalAgedPrice: 9,
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TOMI7GHAeFkU5hvgWGy8byK',
  },
  {
    credit: '40/50',
    opportunity: 'Mixed',
    type: 'Veteran Website Leads',
    description: '40 Fresh & 50 Aged',
    freshPrice: 37,
    agedPrice: 8,
    amount: '$1880.00',
    originalAmount: '$2010.00',
    originalFreshPrice: 39,
    originalAgedPrice: 9,
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TOMIbGHAeFkU5hvZroHGy3I',
  },
  {
    credit: '50/60',
    opportunity: 'Mixed',
    type: 'Veteran Website Leads',
    description: '50 Fresh & 60 Aged',
    freshPrice: 35,
    agedPrice: 8,
    amount: '$2230.00',
    originalAmount: '$2390.00',
    originalFreshPrice: 37,
    originalAgedPrice: 9,
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SPYaBGHAeFkU5hvLNu3kbgu',
  },
];

export const _veteranWebsiteAgedPricingPlans = [
  {
    credit: '30',
    opportunity: 'Aged',
    type: 'Veteran Website Leads',
    price: 9,
    amount: '$270.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TOIjzGHAeFkU5hvO5qYC0y4',
  },
  {
    credit: '40',
    opportunity: 'Aged',
    type: 'Veteran Website Leads',
    price: 8.5,
    amount: '$340.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TOIkqGHAeFkU5hvLIs9lWK3',
  },
  {
    credit: '50',
    opportunity: 'Aged',
    type: 'Veteran Website Leads',
    price: 8,
    amount: '$400.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SQZR0GHAeFkU5hvZjw6sCGS',
  },
];

export const _legacyWebsitePricingPlans = [
  {
    credit: '30',
    opportunity: 'Fresh',
    type: 'Legacy Website Leads',
    price: 31,
    amount: '$930.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SRl2mGHAeFkU5hvHh4zxe8v',
  },
  {
    credit: '40',
    opportunity: 'Fresh',
    type: 'Legacy Website Leads',
    price: 29,
    amount: '$1160.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SRl5PGHAeFkU5hvndn9hxj8',
  },
  {
    credit: '50',
    opportunity: 'Fresh',
    type: 'Legacy Website Leads',
    price: 28,
    amount: '$1400.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SRl6oGHAeFkU5hvuOvS9Iyq',
  },
  {
    credit: '60',
    opportunity: 'Fresh',
    type: 'Legacy Website Leads',
    price: 26,
    amount: '$1560.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SRl8cGHAeFkU5hvSoGRCCfn',
  },
];

export const _legacyWebsiteMixedPricingPlans = [
  {
    credit: '30/40',
    opportunity: 'Mixed',
    type: 'Legacy Website Leads',
    description: '30 Fresh & 40 Aged',
    freshPrice: 29,
    agedPrice: 5,
    amount: '$1070.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SSfnvGHAeFkU5hvlDuwqsWO',
  },
  {
    credit: '40/50',
    opportunity: 'Mixed',
    type: 'Legacy Website Leads',
    description: '40 Fresh & 50 Aged',
    freshPrice: 27,
    agedPrice: 5,
    amount: '$1330.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SSfopGHAeFkU5hvch4ixgSN',
  },
  {
    credit: '50/60',
    opportunity: 'Mixed',
    type: 'Legacy Website Leads',
    description: '50 Fresh & 60 Aged',
    freshPrice: 26,
    agedPrice: 5,
    amount: '$1600.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SSfwKGHAeFkU5hvdcbCJHpe',
  },
  {
    credit: '60/70',
    opportunity: 'Mixed',
    type: 'Legacy Website Leads',
    description: '60 Fresh & 70 Aged',
    freshPrice: 24,
    agedPrice: 5,
    amount: '$1790.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1SSfxKGHAeFkU5hvyGOCcPWr',
  },
];

export const _legacyWebsiteAgedPricingPlans = [
  {
    credit: '50',
    opportunity: 'Aged',
    type: 'Legacy Website Leads',
    price: 5,
    originalPrice: 6,
    originalAmount: '$300.00',
    amount: '$250.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TOJZqGHAeFkU5hvBqEafhBX',
  },
  {
    credit: '100',
    opportunity: 'Aged',
    type: 'Legacy Website Leads',
    price: 4,
    originalPrice: 5,
    originalAmount: '$500.00',
    amount: '$400.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TOJaWGHAeFkU5hv8xOHrJq8',
  },
];

export const _octavianMortgagePricingPlans = [
  {
    credit: '40',
    opportunity: 'Fresh',
    type: 'Legacy Mortgage Leads',
    price: 39,
    amount: '$1560.00',
    lists: ['Disconnected number replacement', 'Exclusive Leads', 'Live lead transfer directly to your CRM', 'Includes call scripts, text templates, and weekly team Q&A sessions'],
    labelAction: 'Purchase',
    priceId: 'price_1TKN1oGHAeFkU5hvHlbOJBnL',
  }
];

// ----------------------------------------------------------------------

export const _testimonials = [
  {
    name: _mock.fullName(1),
    postedDate: _mock.time(1),
    ratingNumber: _mock.number.rating(1),
    avatarUrl: _mock.image.avatar(1),
    content: `Excellent Work! Thanks a lot!`,
  },
  {
    name: _mock.fullName(2),
    postedDate: _mock.time(2),
    ratingNumber: _mock.number.rating(2),
    avatarUrl: _mock.image.avatar(2),
    content: `It's a very good dashboard and we are really liking the product . We've done some things, like migrate to TS and implementing a react useContext api, to fit our job methodology but the product is one of the best in terms of design and application architecture. The team did a really good job.`,
  },
  {
    name: _mock.fullName(3),
    postedDate: _mock.time(3),
    ratingNumber: _mock.number.rating(3),
    avatarUrl: _mock.image.avatar(3),
    content: `Customer support is realy fast and helpful the desgin of this theme is looks amazing also the code is very clean and readble realy good job !`,
  },
  {
    name: _mock.fullName(4),
    postedDate: _mock.time(4),
    ratingNumber: _mock.number.rating(4),
    avatarUrl: _mock.image.avatar(4),
    content: `Amazing, really good code quality and gives you a lot of examples for implementations.`,
  },
  {
    name: _mock.fullName(5),
    postedDate: _mock.time(5),
    ratingNumber: _mock.number.rating(5),
    avatarUrl: _mock.image.avatar(5),
    content: `Got a few questions after purchasing the product. The owner responded very fast and very helpfull. Overall the code is excellent and works very good. 5/5 stars!`,
  },
  {
    name: _mock.fullName(6),
    postedDate: _mock.time(6),
    ratingNumber: _mock.number.rating(6),
    avatarUrl: _mock.image.avatar(6),
    content: `CEO of Codealy.io here. We’ve built a developer assessment platform that makes sense - tasks are based on git repositories and run in virtual machines. We automate the pain points - storing candidates code, running it and sharing test results with the whole team, remotely. Bought this template as we need to provide an awesome dashboard for our early customers. I am super happy with purchase. The code is just as good as the design. Thanks!`,
  },
];

// ----------------------------------------------------------------------

export const _rewardsPricingPlans = [
  {
    credit: '15',
    opportunity: 'Fresh',
    type: 'Veteran Website Leads',
    leadType: 'VeteranWebsite',
    amount: '10000',
    labelAction: 'Redeem',
  },
  {
    credit: '15',
    opportunity: 'Fresh',
    type: 'Legacy Website Leads',
    leadType: 'LegacyWebsite',
    amount: '6000',
    labelAction: 'Redeem',
  },
  {
    credit: '5',
    opportunity: 'Fresh',
    type: 'Veteran Website Leads',
    leadType: 'VeteranWebsite',
    amount: '5000',
    labelAction: 'Redeem',
  },
  {
    credit: '5',
    opportunity: 'Fresh',
    type: 'Legacy Website Leads',
    leadType: 'LegacyWebsite',
    amount: '3000',
    labelAction: 'Redeem',
  },
  {
    credit: '25',
    opportunity: 'Aged',
    type: 'Veteran Website Leads',
    leadType: 'VeteranWebsite',
    amount: '5000',
    labelAction: 'Redeem',
  },
  {
    credit: '25',
    opportunity: 'Aged',
    type: 'Legacy Website Leads',
    leadType: 'LegacyWebsite',
    amount: '3000',
    labelAction: 'Redeem',
  },
];
