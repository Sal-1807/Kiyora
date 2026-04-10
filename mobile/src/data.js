export const COLORS = {
  bg:            '#F5F4F0',
  surface:       '#FFFFFF',
  surface2:      '#F0EFEB',
  border:        '#E5E3DC',
  textPrimary:   '#1A1917',
  textSecondary: '#6B6963',
  textMuted:     '#A09C95',
  green:         '#2D8A4E',
  greenBg:       '#EBF7EF',
  orange:        '#C8630A',
  orangeBg:      '#FEF3E8',
  red:           '#C0392B',
  redBg:         '#FDECEA',
  blue:          '#2563EB',
  blueBg:        '#EFF4FF',
  purple:        '#9333EA',
  purpleBg:      '#F3E8FF',
};

export const SEV_COLOR = {
  low:    COLORS.green,
  medium: COLORS.orange,
  high:   COLORS.red,
};

export const SEV_BG = {
  low:    COLORS.greenBg,
  medium: COLORS.orangeBg,
  high:   COLORS.redBg,
};

export const SEV_LABEL  = { low: 'Low', medium: 'Medium', high: 'High' };
export const SEV_ABBR   = { low: 'Low', medium: 'Med',    high: 'High' };

// Points awarded per severity on cleanup
export const SEV_POINTS = { low: 10, medium: 25, high: 50 };

export const STATUS_CFG = {
  Reported:       { dot: COLORS.blue,   icon: '🗑️', iconBg: '#F0EFEB' },
  'In Progress':  { dot: COLORS.orange, icon: '♻️', iconBg: '#D5F0E0' },
  Cleaned:        { dot: COLORS.green,  icon: '✅', iconBg: '#C8EDDA' },
  pending_proof:  { dot: COLORS.purple, icon: '📸', iconBg: '#F3E8FF' },
};

// Maps status → translation key (used with t() in components)
export const STATUS_LABEL_KEY = {
  'Reported':      'labelReported',
  'In Progress':   'labelInProgress',
  'Cleaned':       'labelCleaned',
  'pending_proof': 'labelPendingProof',
};

export function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)  return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const now = Date.now();

export const SEED_REPORTS = [
  {
    id: 'r1', lat: 13.0524, lng: 80.2488,
    severity: 'high', status: 'Reported',
    description: 'Overflowing bins and plastic waste scattered across the footpath near the market junction.',
    image: null, afterImage: null,
    timestamp: new Date(now - 2 * 3600000), address: 'Anna Salai, Chennai',
  },
  {
    id: 'r2', lat: 13.0418, lng: 80.2341,
    severity: 'medium', status: 'In Progress',
    description: 'Vendor waste and packaging piling up behind the market stalls.',
    image: null, afterImage: null,
    timestamp: new Date(now - 4 * 3600000), address: 'T. Nagar Market, Chennai',
  },
  {
    id: 'r3', lat: 13.1143, lng: 80.1548,
    severity: 'low', status: 'Cleaned',
    description: 'Debris from construction site cleared by local volunteer team.',
    image: null, afterImage: null,
    timestamp: new Date(now - 26 * 3600000), address: 'Ambattur Industrial Area',
  },
  {
    id: 'r4', lat: 12.9762, lng: 77.6033,
    severity: 'high', status: 'Reported',
    description: 'Large pile of garbage dumped on the service road, blocking drainage.',
    image: null, afterImage: null,
    timestamp: new Date(now - 3 * 3600000), address: 'MG Road, Bengaluru',
  },
  {
    id: 'r5', lat: 19.1075, lng: 72.8370,
    severity: 'medium', status: 'Reported',
    description: 'Household waste and food scraps near the bus stop, attracting pests.',
    image: null, afterImage: null,
    timestamp: new Date(now - 5 * 3600000), address: 'Andheri West, Mumbai',
  },
  {
    id: 'r6', lat: 28.6315, lng: 77.2167,
    severity: 'low', status: 'In Progress',
    description: 'Discarded packaging and bottles near the park entrance.',
    image: null, afterImage: null,
    timestamp: new Date(now - 6 * 3600000), address: 'Connaught Place, New Delhi',
  },
  {
    id: 'r7', lat: 22.5354, lng: 88.3506,
    severity: 'high', status: 'Reported',
    description: 'Open waste burning near residential buildings causing smoke and health hazard.',
    image: null, afterImage: null,
    timestamp: new Date(now - 1 * 3600000), address: 'Park Street, Kolkata',
  },
];

export const SEED_LEADERBOARD = [
  { id: 'lb1', name: 'Priya S.',  cleanups: 12, score: 340, isMe: false },
  { id: 'lb2', name: 'Raj M.',    cleanups:  9, score: 275, isMe: false },
  { id: 'lb3', name: 'Anita K.',  cleanups:  7, score: 190, isMe: false },
  { id: 'lb4', name: 'Dev T.',    cleanups:  4, score: 115, isMe: false },
];
