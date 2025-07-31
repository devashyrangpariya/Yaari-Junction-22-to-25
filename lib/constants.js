// lib/constants.js
// Application constants including friend data, navigation items, and configuration

// Friend data for all 13 friends
export const FRIENDS_DATA = [
  {
    id: 'fenil',
    name: 'Fenil',
    nickname: 'Fanta Boss',
    profileImage: '/images/friends/fenil.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/fenil__.07?igsh=OTdvbXppN2J3NjQ0',
    },
    bio: 'Cricket lover, business brain, and master planner.',
    favoriteMemories: ['Sports Day Victory', 'Late Night Study Sessions'],
    joinYear: 2022,
  },
  {
    id: 'preetraj',
    name: 'Preetraj',
    nickname: 'Captaan Saab',
    profileImage: '/images/friends/preetraj.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/preetraj',
    },
    bio: 'The dependable captain and strategic mind.',
    favoriteMemories: ['Funny Moments Collection', 'Group Presentations'],
    joinYear: 2022,
  },
  {
    id: 'om',
    name: 'Om',
    nickname: 'RideMaster OM',
    profileImage: '/images/friends/om.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/_om_7071?igsh=MXRpZm9uMXN6YXpkcA==',
    },
    bio: 'Event planner, car lover, and smooth talker.',
    favoriteMemories: ['Deep Conversations', 'Project Collaborations'],
    joinYear: 2022,
  },
  {
    id: 'vansh',
    name: 'Vansh',
    nickname: 'Lover Boy V',
    profileImage: '/images/friends/vansh.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/patel_vansh_444?igsh=dG9tbjllMWsxNW55',
    },
    bio: 'Flirt king and energy booster of the group.',
    favoriteMemories: ['Dance Performances', 'Sports Competitions'],
    joinYear: 2022,
  },
  {
    id: 'meet',
    name: 'Meet',
    nickname: 'Dada Malik',
    profileImage: '/images/friends/meet.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/ll__meet__patel___ll?igsh=MXhqeDFrb2t2dmM5NQ==',
    },
    bio: 'Our Dada, always connecting hearts and houses.',
    favoriteMemories: ['Group Outings', 'Birthday Celebrations'],
    joinYear: 2022,
  },
  {
    id: 'maharshi',
    name: 'Maharshi',
    nickname: 'Mac Maharaj',
    profileImage: '/images/friends/maharshi.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/ig_maharshi_07?igsh=MWc4bDd6OHJleWtreQ==',
    },
    bio: 'Topper, trader, and the brainiac of the group.',
    favoriteMemories: ['Study Groups', 'Academic Achievements'],
    joinYear: 2022,
  },
  {
    id: 'divy',
    name: 'Divy',
    nickname: 'Comedy Piece',
    profileImage: '/images/friends/divy.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/divy_1106?igsh=MXQxMjh2ZmJ6OGlicw==',
    },
    bio: 'Spreads laughter like it’s his job.',
    favoriteMemories: ['Art Projects', 'Creative Collaborations'],
    joinYear: 2022,
  },
  {
    id: 'ansh',
    name: 'Ansh',
    nickname: 'Jaddu X',
    profileImage: '/images/friends/ansh.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/anshu___1815?igsh=dXlwZnJmeW43eXNn',
    },
    bio: 'Mixes adventure with a hint of mischief.',
    favoriteMemories: ['Adventure Trips', 'Outdoor Activities'],
    joinYear: 2022,
  },
  {
    id: 'kevel',
    name: 'Kevel',
    nickname: 'Roast King',
    profileImage: '/images/friends/kevel.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/kevalpatel96_5?igsh=ZnhyN2Z1MTV3YWFw',
    },
    bio: 'Roasting expert and laugh master.',
    favoriteMemories: ['Tech Projects', 'Coding Sessions'],
    joinYear: 2022,
  },
  {
    id: 'rudra',
    name: 'Rudra',
    nickname: 'Heart Hacker',
    profileImage: '/images/friends/rudra.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/_.rudra._.24?igsh=MWF5dzllaDN2NmFlcA==',
    },
    bio: 'Smooth operator and motivational buddy.',
    favoriteMemories: ['Motivational Talks', 'Team Building'],
    joinYear: 2022,
  },
  {
    id: 'smit',
    name: 'Smit',
    nickname: 'Mr. Formal',
    profileImage: '/images/friends/smit.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/_smit_hirani_?igsh=Y3E5bmhhdnQzNTVr',
    },
    bio: 'Dresses to impress, plans to success.',
    favoriteMemories: ['Event Planning', 'Group Coordination'],
    joinYear: 2022,
  },
  {
    id: 'devashy',
    name: 'Devashy',
    nickname: 'coding',
    profileImage: '/images/friends/devashy.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/_devashy_.06?igsh=anB1azFzenVlamJ3',
    },
    bio: 'Coding like a boss, sipping Pepsi nonstop.',
    favoriteMemories: ['Coding Competitions', 'Hackathons'],
    joinYear: 2022,
  },
  {
    id: 'deepak',
    name: 'Deepak',
    nickname: 'santoor',
    profileImage: '/images/friends/deepak.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/__deepak.m_25?igsh=b3BybGF3NXRxdG5w',
    },
    bio: 'Coding like a boss, sipping Pepsi nonstop.',
    favoriteMemories: ['Coding Competitions', 'Hackathons'],
    joinYear: 2022,
  }
];

// Gallery years
export const GALLERY_YEARS = ['2022', '2023', '2024', '2025'];

// Navigation items
export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/home', icon: 'home' },
  { name: 'Gallery', href: '/gallery', icon: 'photo' },
  { name: 'Friends', href: '/friends', icon: 'users' },
  // { name: 'Sports', href: '/sports', icon: 'trophy' },
  // { name: 'Funny Moments', href: '/funny-moments', icon: 'smile' },
  // { name: 'Profile', href: '/profile', icon: 'user' },
];

// App metadata
export const APP_METADATA = {
  title: 'College Memory Gallery',
  description: 'A dynamic gallery showcasing college memories from 2022-2025',
  collegeName: 'Yaari Junction 22-25',
  graduationYear: 2025,
  author: 'Devashy Rangpariya',
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  extraSlow: 800,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Image upload constraints
export const IMAGE_UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxBatchSize: 20,
};

// Cloudinary transformation presets
export const CLOUDINARY_PRESETS = {
  thumbnail: { width: 300, height: 200, crop: 'fill' },
  medium: { width: 800, height: 600, crop: 'limit' },
  large: { width: 1200, height: 900, crop: 'limit' },
  hero: { width: 1920, height: 1080, crop: 'fill' },
};

// Sports teams data
export const SPORTS_TEAMS = [
  {
    id: 'cricke-ar11',
    name: 'Cricke AR11',
    logo: '/images/sports/cricke-ar11-logo.png',
    colors: {
      primary: '#1e40af', // Blue
      secondary: '#fbbf24', // Yellow
    },
    foundedYear: 2022,
    description: 'Our cricket team that dominated the college tournaments with strategic gameplay and team spirit.',
    sport: 'Cricket',
  },
  {
    id: 'satoliya-ar7',
    name: 'Satoliya AR7',
    logo: '/images/sports/satoliya-ar7-logo.png',
    colors: {
      primary: '#dc2626', // Red
      secondary: '#ffffff', // White
    },
    foundedYear: 2022,
    description: 'The Satoliya team that brought glory to our college with their exceptional skills and teamwork.',
    sport: 'Football',
  },
];

// Sports achievements data
export const SPORTS_ACHIEVEMENTS = [
  // Satoliya AR7 Football Victories
  {
    id: 'satoliya-final-2022',
    title: 'Inter-College satoliya Championship Final',
    date: new Date('2023-04-18'),
    description: 'Dominated the championship final with a spectacular 3-1 victory, showcasing exceptional teamwork and strategic gameplay.',
    images: ['/images/sports/football-victory-2023.jpg'],
    teamId: 'satoliya-ar7',
    type: 'victory',
    position: '1st Place',
    score: '15-8',
    highlights: ['Hat-trick by captain', 'Unbeaten defense', 'Record attendance'],
  },
  {
    id: 'satoliya-final-2023',
    title: 'Inter-College satoliya Championship Final',
    date: new Date('2024-03-22'),
    description: 'Secured another championship title with a thrilling 2-0 victory in the regional league final.',
    images: ['/images/sports/satoliya-2023.jpg'],
    teamId: 'satoliya-ar7',
    type: 'victory',
    position: '1st Place',
    score: '12-6',
    highlights: ['Clean sheet victory', 'Perfect season record', 'Team spirit award'],
  },
  {
    id: 'satoliya-final-2024',
    title: 'Inter-College satoliya Championship Final',
    date: new Date('2025-01-15'),
    description: 'Completed the hat-trick of victories with a commanding 10-2 win in the state championship final.',
    images: ['/images/sports/football-victory-2024.jpg'],
    teamId: 'satoliya-ar7',
    type: 'victory',
    position: '1st Place',
    score: '10-9',
    highlights: ['Triple championship', 'Outstanding teamwork', 'State recognition'],
  },
  {
    id: 'satoliya-final-2025',
    title: 'Inter-College satoliya Championship Final',
    date: new Date('2025-01-15'),
    description: 'Completed the hat-trick of victories with a commanding 10-7 win in the state championship final.',
    images: ['/images/sports/football-victory-2024.jpg'],
    teamId: 'satoliya-ar7',
    type: 'victory',
    position: '1st Place',
    score: '10-7',
    highlights: ['Triple championship', 'Outstanding teamwork', 'State recognition'],
  },
  // Cricke AR11 Cricket Achievement
  {
    id: 'cricke-semifinal-2025',
    title: 'National Cricket Tournament Semi-Final',
    date: new Date('2025-02-08'),
    description: 'Reached the prestigious semi-finals of the national cricket tournament with outstanding batting and bowling performances.',
    images: ['/images/sports/cricket-victory-2025.jpg'],
    teamId: 'cricke-ar11',
    type: 'achievement',
    position: 'Semi-Final',
    score: 'Won by 26 runs',
    highlights: ['Century partnership', 'Bowling figures 5/32', 'Team record score'],
  },
];

// Funny moments data
export const FUNNY_MOMENTS = [
  {
    id: 'funny-1',
    title: 'Canteen Fire MasterChef Edition',
    image: '/images/funny/canteen-chaos.jpg',
    caption: 'Divy tried making “Maggi 2.0” with extra masala... and triggered the fire alarm. Gordon Ramsay would be speechless.',
    date: new Date('2023-05-15'),
    participants: ['divy', 'fenil', 'vansh', 'meet'],
    category: 'epic-fails',
    reactions: { laughs: 103, loves: 45, surprises: 18 },
    comments: [
      {
        id: 'c1',
        author: 'fenil',
        text: 'Still can’t believe we had to evacuate for masala Maggi 😂',
        timestamp: new Date('2023-05-15T14:30:00'),
      },
      {
        id: 'c2',
        author: 'vansh',
        text: 'Divy unlocked a new level of chaos that day 🔥',
        timestamp: new Date('2023-05-15T15:45:00'),
      }
    ],
  },
  {
    id: 'funny-2',
    title: '₹50 Stock Market Crash',
    image: '/images/funny/stock-panic.jpg',
    caption: 'Maharshi lost ₹50 and looked like he just saw the NIFTY crash live. Someone hand him an Oscar.',
    date: new Date('2023-08-22'),
    participants: ['maharshi', 'kevel', 'rudra', 'smit'],
    category: 'drama-queen',
    reactions: { laughs: 148, loves: 76, surprises: 11 },
    comments: [
      {
        id: 'c3',
        author: 'kevel',
        text: 'Bro was pacing like Sensex CEO 😭',
        timestamp: new Date('2023-08-22T16:20:00'),
      },
      {
        id: 'c4',
        author: 'maharshi',
        text: '₹50 now, billionaire later 💼📉',
        timestamp: new Date('2023-08-22T16:25:00'),
      }
    ],
  },
  {
    id: 'funny-3',
    title: 'Dating Guru... Who?',
    image: '/images/funny/dating-guru.jpg',
    caption: 'Om giving dating advice to Ansh while being single since birth. Confidence = 100, Experience = -10.',
    date: new Date('2024-02-14'),
    participants: ['om', 'ansh', 'vansh', 'rudra'],
    category: 'relationship-comedy',
    reactions: { laughs: 181, loves: 53, surprises: 21 },
    comments: [
      {
        id: 'c5',
        author: 'ansh',
        text: 'Bro quoted SRK movies and expected results 😭',
        timestamp: new Date('2024-02-14T18:30:00'),
      },
      {
        id: 'c6',
        author: 'vansh',
        text: 'Om: *"Trust me bro"* = red flag 🚩',
        timestamp: new Date('2024-02-14T19:15:00'),
      }
    ],
  },
  {
    id: 'funny-4',
    title: 'Lost with the Leader',
    image: '/images/funny/captain-chaos.jpg',
    caption: 'Preetraj refused Google Maps because “real leaders never ask directions.” We toured the same area 3 times.',
    date: new Date('2023-11-10'),
    participants: ['preetraj', 'meet', 'devashy', 'smit'],
    category: 'travel-fails',
    reactions: { laughs: 133, loves: 42, surprises: 17 },
    comments: [
      {
        id: 'c7',
        author: 'meet',
        text: 'Tea stall guy knew us by name at the end 😅',
        timestamp: new Date('2023-11-10T20:45:00'),
      },
      {
        id: 'c8',
        author: 'devashy',
        text: 'Captain Saab unlocked "Lost & Found" badge 🧭',
        timestamp: new Date('2023-11-10T21:00:00'),
      }
    ],
  },
  {
    id: 'funny-5',
    title: 'Roast Master Got Roasted',
    image: '/images/funny/roast-master.jpg',
    caption: 'Kevel tried to roast the professor, professor clapped back harder than a Netflix special. Whole class went silent.',
    date: new Date('2024-01-18'),
    participants: ['kevel', 'divy', 'maharshi', 'fenil'],
    category: 'classroom-comedy',
    reactions: { laughs: 221, loves: 73, surprises: 34 },
    comments: [
      {
        id: 'c9',
        author: 'divy',
        text: 'Roast turned into toast 🔥🍞',
        timestamp: new Date('2024-01-18T11:30:00'),
      },
      {
        id: 'c10',
        author: 'fenil',
        text: 'Even the backbenchers felt that burn 💀',
        timestamp: new Date('2024-01-18T11:35:00'),
      }
    ],
  },
  {
    id: 'funny-6',
    title: 'Blink And Miss',
    image: '/images/funny/photo-fail.jpg',
    caption: '30 mins for one perfect group photo. Final shot: everyone blinked. Camera battery died. 💀',
    date: new Date('2024-03-25'),
    participants: ['fenil', 'preetraj', 'om', 'vansh', 'meet', 'maharshi', 'divy', 'ansh', 'kevel', 'rudra', 'smit', 'devashy'],
    category: 'group-fails',
    reactions: { laughs: 193, loves: 84, surprises: 28 },
    comments: [
      {
        id: 'c11',
        author: 'vansh',
        text: 'The photographer gave up before we did 😭',
        timestamp: new Date('2024-03-25T16:20:00'),
      },
      {
        id: 'c12',
        author: 'smit',
        text: 'Only thing we clicked was patience limit 📷',
        timestamp: new Date('2024-03-25T16:25:00'),
      }
    ],
  },
];


// Funny moment categories
export const FUNNY_CATEGORIES = [
  { id: 'all', name: 'All Moments', icon: '😂', color: 'bg-purple-500' },
  { id: 'epic-fails', name: 'Epic Fails', icon: '🤦‍♂️', color: 'bg-red-500' },
  { id: 'drama-queen', name: 'Drama Queen', icon: '🎭', color: 'bg-pink-500' },
  { id: 'relationship-comedy', name: 'Love Guru', icon: '💕', color: 'bg-rose-500' },
  { id: 'travel-fails', name: 'Travel Chaos', icon: '🗺️', color: 'bg-blue-500' },
  { id: 'classroom-comedy', name: 'Class Clowns', icon: '🎓', color: 'bg-green-500' },
  { id: 'group-fails', name: 'Group Disasters', icon: '👥', color: 'bg-orange-500' },
];

// Legacy export for backward compatibility
export const FRIENDS = FRIENDS_DATA;