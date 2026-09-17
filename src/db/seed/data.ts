import { hashSync } from 'bcryptjs';

export const ADMIN_EMAIL = 'admin@vedicfuture.com';
export const ADMIN_PASSWORD = 'password123';

export const seedAdmin = {
  email: ADMIN_EMAIL,
  passwordHash: hashSync(ADMIN_PASSWORD, 12),
};

export const seedServices = [
  {
    kind: 'kundali' as const,
    slug: 'kundali',
    name: 'Detailed Kundali',
    summary: 'Comprehensive birth chart analysis',
    description: 'Get deep insights into your life, career, and relationships through an in-depth Kundali reading.',
    priceInr: 1500,
    sortOrder: 1,
    isPublished: true,
  },
  {
    kind: 'matching' as const,
    slug: 'kundli-milan',
    name: 'Kundli Milan (Matchmaking)',
    summary: 'Ashtakoot Guna Milan for marriage compatibility',
    description: 'Check compatibility with your prospective partner based on traditional Vedic astrology.',
    priceInr: 2100,
    sortOrder: 2,
    isPublished: true,
  },
  {
    kind: 'vastu' as const,
    slug: 'vastu-consultation',
    name: 'Vastu Shastra Consultation',
    summary: 'Harmonize your living or working space',
    description: 'Expert advice on Vastu to bring prosperity and peace to your home or office.',
    quoteOnly: true,
    sortOrder: 3,
    isPublished: true,
  }
];
