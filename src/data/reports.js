/**
 * Dummy seed data — 7 realistic reports across Southeast Asia.
 * The map defaults to this region so all markers are visible on load.
 */
export const DUMMY_REPORTS = [
  {
    id: 'r1',
    lat: 14.6042,
    lng: 120.9822,
    severity: 'high',
    status: 'reported',
    description:
      'Large pile of mixed household and construction waste blocking the drainage canal. Strong odour affecting nearby homes.',
    image: 'https://picsum.photos/seed/garbage01/400/260',
    timestamp: new Date('2025-04-01T08:30:00'),
    address: 'Tondo, Manila',
  },
  {
    id: 'r2',
    lat: 14.6760,
    lng: 121.0437,
    severity: 'medium',
    status: 'in_progress',
    description:
      'Scattered plastic bags, bottles, and food packaging along the roadside near the elementary school.',
    image: 'https://picsum.photos/seed/garbage02/400/260',
    timestamp: new Date('2025-04-02T14:20:00'),
    address: 'Quezon City, Metro Manila',
  },
  {
    id: 'r3',
    lat: 14.5547,
    lng: 121.0175,
    severity: 'low',
    status: 'cleaned',
    description:
      'Small accumulation of food packaging and wrappers near the park entrance. Cleared by morning volunteer crew.',
    image: null,
    timestamp: new Date('2025-04-03T10:15:00'),
    address: 'Makati City',
  },
  {
    id: 'r4',
    lat: 13.7563,
    lng: 100.5018,
    severity: 'high',
    status: 'reported',
    description:
      'Illegal dumping of construction debris beside the canal. The pile has been growing for weeks and now partially blocks pedestrian access.',
    image: 'https://picsum.photos/seed/garbage04/400/260',
    timestamp: new Date('2025-04-04T16:45:00'),
    address: 'Bangkok, Thailand',
  },
  {
    id: 'r5',
    lat: -6.2088,
    lng: 106.8456,
    severity: 'medium',
    status: 'reported',
    description:
      'Overflowing public trash bins near the market area. Collection has been missed for several days.',
    image: null,
    timestamp: new Date('2025-04-05T09:00:00'),
    address: 'Central Jakarta, Indonesia',
  },
  {
    id: 'r6',
    lat: 3.1390,
    lng: 101.6869,
    severity: 'low',
    status: 'in_progress',
    description:
      'Discarded electronics and batteries left beside a residential dumpster. Potential environmental hazard.',
    image: 'https://picsum.photos/seed/garbage06/400/260',
    timestamp: new Date('2025-04-06T11:30:00'),
    address: 'Kuala Lumpur, Malaysia',
  },
  {
    id: 'r7',
    lat: 10.7769,
    lng: 106.7009,
    severity: 'high',
    status: 'reported',
    description:
      'Burning waste pile in an open lot, generating toxic smoke. Immediate attention required.',
    image: 'https://picsum.photos/seed/garbage07/400/260',
    timestamp: new Date('2025-04-07T07:15:00'),
    address: 'Ho Chi Minh City, Vietnam',
  },
];
