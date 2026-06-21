import type { PackageInfo } from '@/types/booking';

export const PACKAGES: PackageInfo[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 4500,
    priceFormatted: 'R 4,500',
    coverage: '4 hours',
    photographers: 1,
    editedImages: '150',
    highlight: 'Perfect for intimate events and smaller gatherings',
    includes: [
      '4 hours of professional coverage',
      '1 experienced photographer',
      '150 professionally edited digital images',
      'Private password-protected online gallery',
      'Digital download licence for personal use',
      'Delivery within 2 weeks',
    ],
  },
  {
    id: 'medium',
    name: 'Medium',
    price: 8500,
    priceFormatted: 'R 8,500',
    coverage: '6 hours',
    photographers: 1,
    editedImages: '300',
    highlight: 'Ideal for birthdays, graduations, and anniversaries',
    includes: [
      '6 hours of professional coverage',
      '1 experienced photographer',
      '300 professionally edited digital images',
      'Private password-protected online gallery',
      'Digital download',
      'Basic printed album (20 pages)',
      'Delivery within 2 weeks',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15000,
    priceFormatted: 'R 15,000',
    coverage: '8 hours (full day)',
    photographers: 2,
    editedImages: '500',
    highlight: 'Full-day coverage with a second photographer for weddings',
    includes: [
      '8 hours of coverage (full day)',
      '2 professional photographers',
      '500 professionally edited digital images',
      'Private password-protected online gallery',
      'Hardcover printed album (40 pages)',
      'USB drive with all final images',
      'Pre-event consultation',
      'Delivery within 3 weeks',
    ],
  },
  {
    id: 'super_premium',
    name: 'Super Premium',
    price: 24000,
    priceFormatted: 'R 24,000',
    coverage: '12 hours (full day + evening)',
    photographers: 2,
    editedImages: '700+',
    highlight: 'The ultimate experience — every moment captured, nothing missed',
    includes: [
      '12 hours of coverage (full day + evening)',
      '2 professional photographers',
      '700+ professionally edited digital images',
      'Private password-protected online gallery',
      'Luxury leather-bound album (60 pages)',
      'USB drive with all final images',
      '10 × A4 fine art prints',
      'Pre-event consultation',
      'Engagement / pre-shoot session',
      'Same-day social media highlight pack',
      'Priority delivery within 2 weeks',
    ],
  },
];

export function getPackageById(id: string): PackageInfo | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export function getPackageDisplayName(id: string): string {
  const pkg = getPackageById(id);
  return pkg ? pkg.name : id;
}
