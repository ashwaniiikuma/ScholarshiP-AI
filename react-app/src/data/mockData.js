export const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const stepItems = [
  { key: 'personal', label: 'Personal', description: 'Identity and location' },
  { key: 'academic', label: 'Academic', description: 'Course and marks' },
  { key: 'financial', label: 'Financial', description: 'Income and category' },
  { key: 'review', label: 'Review', description: 'Final submission' },
];

export const courseOptions = [
  'Class 10',
  'Class 12',
  'Diploma',
  'Undergraduate - Year 1',
  'Undergraduate - Year 2',
  'Undergraduate - Year 3',
  'Undergraduate - Year 4',
  'Postgraduate',
  'Doctorate',
];

export const streamOptions = [
  'Science (PCM)',
  'Science (PCB)',
  'Commerce',
  'Arts / Humanities',
  'Engineering and Technology',
  'Medical / MBBS',
  'Law / LLB',
  'Management / MBA',
  'Computer Science / IT',
  'Design and Architecture',
  'Pharmacy',
  'Other',
];

export const yearOptions = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];

export const incomeOptions = [
  'Below Rs 1,00,000',
  'Rs 1,00,000 - Rs 2,50,000',
  'Rs 2,50,000 - Rs 5,00,000',
  'Rs 5,00,000 - Rs 8,00,000',
  'Above Rs 8,00,000',
];

export const categoryOptions = [
  'General',
  'OBC',
  'SC',
  'ST',
  'EWS',
  'Minority',
];

export const educationLevelOptions = [
  'School',
  'Diploma',
  'Undergraduate',
  'Postgraduate',
  'Doctorate',
];

export const quickActions = [
  {
    title: 'Complete application',
    description: 'Finish your profile steps and submit with confidence.',
    href: '/review-submit',
  },
  {
    title: 'Browse scholarships',
    description: 'Open your strongest recommendation and check fit.',
    href: '/programs/sbi-scholarship',
  },
  {
    title: 'Review alerts',
    description: 'Prioritize unread deadline reminders and document tasks.',
    href: '/notifications',
  },
  {
    title: 'Ask the assistant',
    description: 'Get quick answers on documents, deadlines, and eligibility.',
    href: '/assistant',
  },
];

export const programs = [
  {
    id: 'sbi-scholarship',
    slug: 'sbi-scholarship',
    title: 'SBI Scholarship Program',
    provider: 'State Bank of India Foundation',
    match: 95,
    amount: 'Up to Rs 60,000',
    deadline: '25 Jun 2026',
    seats: '5000+',
    highlight: 'Strong fit for second-year engineering students with household income below Rs 5 lakh.',
    description:
      'This scholarship supports meritorious students from economically weaker sections so they can continue higher education without interruption.',
    eligibility: [
      'Minimum 60% in the previous qualifying exam',
      'Family income up to Rs 6 lakh per annum',
      'Open for undergraduate and postgraduate students',
      'Applicant must be an Indian citizen',
    ],
    documents: [
      'Aadhaar card',
      'Income certificate',
      'Latest marksheet',
      'Bank passbook',
    ],
    related: [
      { name: 'HDFC Merit Scholarship', amount: 'Up to Rs 50,000', match: 88 },
      { name: 'National Scholarship Scheme', amount: 'Up to Rs 1,20,000', match: 82 },
      { name: 'Tata Trust Grant', amount: 'Up to Rs 75,000', match: 79 },
    ],
    faq: [
      {
        question: 'Can I apply for multiple scholarships?',
        answer: 'Yes. You can apply to multiple programs as long as you meet each eligibility rule.',
      },
      {
        question: 'How long does approval take?',
        answer: 'Most applications are reviewed within 3 to 4 weeks after the deadline closes.',
      },
      {
        question: 'Is there an application fee?',
        answer: 'No. This scholarship does not charge any application fee.',
      },
    ],
  },
  {
    id: 'nsp-scholarship',
    slug: 'nsp-scholarship',
    title: 'National Scholarship Portal',
    provider: 'Government of India',
    match: 90,
    amount: 'Up to Rs 75,000',
    deadline: '20 Jul 2026',
    seats: 'Open',
    highlight: 'Ideal when you want a broad public-sector option with strong document-backed eligibility.',
    description:
      'A government-backed scholarship track designed to support students across merit, category, and income-based schemes.',
    eligibility: [
      'Valid academic admission for the current year',
      'Meets scheme-specific income and category requirements',
      'Bank account linked with Aadhaar',
    ],
    documents: ['Identity proof', 'Income proof', 'Admission letter', 'Academic transcript'],
    related: [],
    faq: [],
  },
  {
    id: 'merit-means',
    slug: 'merit-means',
    title: 'Merit-cum-Means Scholarship',
    provider: 'State Education Board',
    match: 86,
    amount: 'Up to Rs 50,000',
    deadline: '30 Jun 2026',
    seats: '1200',
    highlight: 'Good option when marks are strong and the family income bracket is a deciding factor.',
    description:
      'Designed for students with strong academic performance who also need financial support to continue their studies.',
    eligibility: [
      'Consistent academic score above 70%',
      'Income within the approved merit-cum-means bracket',
    ],
    documents: ['Marksheets', 'Income proof', 'Bonafide certificate'],
    related: [],
    faq: [],
  },
];

export const recommendedPrograms = [
  {
    id: 'sbi-scholarship',
    title: 'SBI Scholarship Program',
    amount: 'Rs 60,000',
    deadline: '25 Jun 2026',
    match: 95,
    summary: 'High-fit support for engineering students from lower income brackets.',
  },
  {
    id: 'merit-means',
    title: 'Merit-cum-Means Scholarship',
    amount: 'Rs 50,000',
    deadline: '30 Jun 2026',
    match: 90,
    summary: 'Best for students with strong grades and verified household income.',
  },
  {
    id: 'nsp-scholarship',
    title: 'National Scholarship Portal',
    amount: 'Rs 75,000',
    deadline: '20 Jul 2026',
    match: 85,
    summary: 'Wide government scheme coverage with category-based opportunities.',
  },
];

export const deadlineItems = [
  { id: 'nsp', name: 'National Scholarship Portal', date: '20 Jun 2026', tone: 'urgent', daysLeft: 3 },
  { id: 'sbi', name: 'SBI Scholarship Program', date: '25 Jun 2026', tone: 'soon', daysLeft: 8 },
  { id: 'merit', name: 'Merit-cum-Means Scholarship', date: '30 Jun 2026', tone: 'calm', daysLeft: 13 },
  { id: 'inspire', name: 'Inspire Scholarship', date: '10 Jul 2026', tone: 'calm', daysLeft: 23 },
];

export const applicationItems = [
  {
    id: 'pm-scholarship',
    title: 'PM Scholarship Scheme',
    amount: 'Rs 36,000 per year',
    status: 'Under review',
    tone: 'positive',
  },
  {
    id: 'vidyasaarathi',
    title: 'Vidyasaarathi Scholarship',
    amount: 'Rs 25,000',
    status: 'Documents pending',
    tone: 'warning',
  },
];

export const activityFeed = [
  { id: 'activity-1', title: 'Application submitted for PM Scholarship', time: 'Today, 10:32 AM' },
  { id: 'activity-2', title: 'Profile viewed by SBI Scholarship committee', time: 'Yesterday, 3:15 PM' },
  { id: 'activity-3', title: 'Document request received for Vidyasaarathi', time: '2 days ago' },
  { id: 'activity-4', title: 'New match found for Inspire Scholarship', time: '3 days ago' },
];

export const initialNotifications = [
  {
    id: 'notif-1',
    category: 'deadline',
    title: 'SBI scholarship closes in 8 days',
    description: 'Upload your income certificate to keep the application eligible.',
    time: '9 min ago',
    read: false,
  },
  {
    id: 'notif-2',
    category: 'application',
    title: 'PM Scholarship moved to under review',
    description: 'Your submitted application passed the first verification stage.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 'notif-3',
    category: 'profile',
    title: 'Profile completion increased to 88%',
    description: 'Academic details are complete. Review financial information next.',
    time: 'Today',
    read: true,
  },
  {
    id: 'notif-4',
    category: 'assistant',
    title: 'Assistant prepared a document checklist',
    description: 'Open the assistant page to reuse the recommended upload checklist.',
    time: 'Yesterday',
    read: false,
  },
  {
    id: 'notif-5',
    category: 'deadline',
    title: 'Merit-cum-Means reminder scheduled',
    description: 'You will get a final reminder 48 hours before the deadline.',
    time: 'Yesterday',
    read: true,
  },
];

export const assistantQuickReplies = [
  'What documents are required?',
  'How do I apply for NSP?',
  'What is the last date for SBI Scholarship?',
];

export const initialAssistantMessages = [
  {
    id: 'msg-1',
    role: 'bot',
    content:
      'Hi Arjun. I can help with scholarships, eligibility, deadlines, document checklists, and application strategy. Ask a question or use a quick reply below.',
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Which scholarships am I eligible for?',
  },
  {
    id: 'msg-3',
    role: 'bot',
    content:
      'Based on your current profile, the strongest matches are SBI Scholarship Program, National Scholarship Portal, and Merit-cum-Means Scholarship. SBI is currently your highest-confidence fit.',
  },
];

export const portalNav = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Programs', href: '/programs/sbi-scholarship' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Assistant', href: '/assistant' },
];
