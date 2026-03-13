export const BIAS_COLORS = {
  LEFT: "#3B82F6",
  CENTER_LEFT: "#60A5FA",
  CENTER: "#6B7280",
  CENTER_RIGHT: "#F87171",
  RIGHT: "#EF4444",
} as const;

export const NARRATIVE_COLORS = {
  left: "#3B82F6",
  commonGround: "#10B981",
  right: "#EF4444",
  implications: "#6B7280",
} as const;

export const DEFAULT_CONFIDENCE_THRESHOLD = 0.8;
export const AUTO_REJECT_THRESHOLD = 0.4;
export const STORIES_PER_PAGE = 20;

export const SOURCE_BIAS_MAP: Record<string, string> = {
  // Left-leaning
  "NPR": "LEFT",
  "CNN": "LEFT",
  "MSNBC": "LEFT",
  "NBC News": "LEFT",
  "The Guardian": "LEFT",
  "Vox": "LEFT",
  "The Intercept": "LEFT",
  "Jacobin": "LEFT",
  "HuffPost": "LEFT",
  "The Washington Post": "CENTER_LEFT",
  "The New York Times": "CENTER_LEFT",
  "BBC News": "CENTER_LEFT",
  "ABC News": "CENTER_LEFT",
  "CBS News": "CENTER_LEFT",

  // Center
  "AP": "CENTER",
  "Associated Press": "CENTER",
  "Reuters": "CENTER",
  "PBS NewsHour": "CENTER",
  "PBS": "CENTER",
  "The Hill": "CENTER",
  "Politico": "CENTER",
  "USA Today": "CENTER",

  // Right-leaning
  "Fox News": "RIGHT",
  "Wall Street Journal": "CENTER_RIGHT",
  "WSJ": "CENTER_RIGHT",
  "The Daily Wire": "RIGHT",
  "National Review": "RIGHT",
  "The Federalist": "RIGHT",
  "Breitbart": "RIGHT",
  "New York Post": "CENTER_RIGHT",
  "Washington Examiner": "CENTER_RIGHT",
  "The Epoch Times": "RIGHT",
};

export const RSS_FEEDS = [
  // Left-leaning
  { name: "NPR", url: "https://feeds.npr.org/1001/rss.xml", bias: "LEFT" as const },
  { name: "CNN Politics", url: "http://rss.cnn.com/rss/cnn_allpolitics.rss", bias: "LEFT" as const },
  { name: "NBC News", url: "https://feeds.nbcnews.com/nbcnews/public/politics", bias: "LEFT" as const },
  { name: "The Guardian US", url: "https://www.theguardian.com/us-news/rss", bias: "LEFT" as const },
  { name: "Vox", url: "https://www.vox.com/rss/index.xml", bias: "LEFT" as const },

  // Center
  { name: "AP News", url: "https://apnews.com/apf-topnews/feed", bias: "CENTER" as const },
  { name: "PBS NewsHour", url: "https://www.pbs.org/newshour/feeds/rss/headlines", bias: "CENTER" as const },
  { name: "The Hill", url: "https://thehill.com/feed/", bias: "CENTER" as const },
  { name: "Politico", url: "https://www.politico.com/rss/politicopicks.xml", bias: "CENTER" as const },

  // Right-leaning
  { name: "Fox News", url: "https://moxie.foxnews.com/google-publisher/politics.xml", bias: "RIGHT" as const },
  { name: "National Review", url: "https://www.nationalreview.com/feed/", bias: "RIGHT" as const },
  { name: "The Federalist", url: "https://thefederalist.com/feed/", bias: "RIGHT" as const },
];

export const DEFAULT_TOPICS = [
  { name: "US Policy & Legislation", slug: "us-policy", icon: "🏛️", description: "Federal and state legislation, executive orders, and regulatory actions" },
  { name: "Education System", slug: "education", icon: "🎓", description: "K-12 and higher education policy, reform, and funding" },
  { name: "Healthcare & Pharmaceuticals", slug: "healthcare", icon: "🏥", description: "Public health policy, drug pricing, insurance, and medical research" },
  { name: "AI & Technology", slug: "ai-tech", icon: "🤖", description: "AI regulation, tech policy, data privacy, and digital infrastructure" },
  { name: "Economy & Finance", slug: "economy", icon: "💰", description: "Fiscal policy, Federal Reserve actions, inflation, and economic indicators" },
  { name: "Environment & Energy", slug: "environment", icon: "🌍", description: "Climate policy, renewable energy, conservation, and environmental regulation" },
  { name: "National Security & Defense", slug: "national-security", icon: "🛡️", description: "Military policy, intelligence, cybersecurity, and homeland security" },
  { name: "Foreign Policy", slug: "foreign-policy", icon: "🌐", description: "International relations, treaties, diplomacy, and global affairs" },
  { name: "Civil Rights & Social Justice", slug: "civil-rights", icon: "⚖️", description: "Equal rights, discrimination policy, voting rights, and social equity" },
  { name: "Infrastructure & Transportation", slug: "infrastructure", icon: "🚂", description: "Roads, bridges, public transit, broadband, and water systems" },
  { name: "Immigration", slug: "immigration", icon: "🛂", description: "Border policy, visa programs, asylum, and citizenship pathways" },
  { name: "Criminal Justice Reform", slug: "criminal-justice", icon: "🔒", description: "Policing reform, sentencing policy, prison reform, and judicial oversight" },
  { name: "Housing & Real Estate", slug: "housing", icon: "🏠", description: "Housing affordability, zoning, mortgage policy, and homelessness" },
  { name: "Labor & Employment", slug: "labor", icon: "👷", description: "Workers' rights, wage policy, unions, and workplace regulation" },
];
