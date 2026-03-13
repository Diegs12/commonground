import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const DEFAULT_TOPICS = [
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

async function main() {
  console.log("Seeding database...");

  // Create topics
  for (const topic of DEFAULT_TOPICS) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: { name: topic.name, icon: topic.icon, description: topic.description },
      create: { ...topic, isDefault: true },
    });
  }
  console.log(`Seeded ${DEFAULT_TOPICS.length} topics`);

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "diego@commonground.app";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isAdmin: true },
    create: {
      email: adminEmail,
      name: "Diego",
      passwordHash,
      authProvider: "EMAIL",
      isAdmin: true,
      onboardingCompleted: true,
    },
  });
  console.log(`Admin user created: ${adminEmail}`);

  // Create default admin settings
  await prisma.adminSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      confidenceThreshold: 0.8,
      autoPublishEnabled: true,
      ingestionIntervalMin: 60,
    },
  });
  console.log("Admin settings created");

  // Create quiz questions
  const topicsBySlug: Record<string, string> = {};
  const topics = await prisma.topic.findMany();
  for (const t of topics) {
    topicsBySlug[t.slug] = t.id;
  }

  // Question 1
  const q1 = await prisma.quizQuestion.upsert({
    where: { id: "q1" },
    update: {},
    create: {
      id: "q1",
      questionText: "Which of these issues affects your daily life the most?",
      questionType: "MULTIPLE_CHOICE",
      order: 1,
    },
  });

  const q1Options = [
    { text: "Healthcare costs", mappings: { [topicsBySlug["healthcare"]]: 5, [topicsBySlug["economy"]]: 2 } },
    { text: "Education quality", mappings: { [topicsBySlug["education"]]: 5 } },
    { text: "Job market and the economy", mappings: { [topicsBySlug["economy"]]: 5, [topicsBySlug["labor"]]: 3 } },
    { text: "Technology and privacy", mappings: { [topicsBySlug["ai-tech"]]: 5, [topicsBySlug["civil-rights"]]: 2 } },
    { text: "Environment and energy", mappings: { [topicsBySlug["environment"]]: 5 } },
    { text: "National security", mappings: { [topicsBySlug["national-security"]]: 5, [topicsBySlug["foreign-policy"]]: 2 } },
    { text: "Housing affordability", mappings: { [topicsBySlug["housing"]]: 5, [topicsBySlug["economy"]]: 2 } },
    { text: "Immigration policy", mappings: { [topicsBySlug["immigration"]]: 5, [topicsBySlug["us-policy"]]: 2 } },
  ];

  for (let i = 0; i < q1Options.length; i++) {
    await prisma.quizOption.upsert({
      where: { id: `q1-o${i + 1}` },
      update: {},
      create: {
        id: `q1-o${i + 1}`,
        questionId: q1.id,
        optionText: q1Options[i].text,
        topicMappings: q1Options[i].mappings,
        order: i + 1,
      },
    });
  }

  // Question 2
  const q2 = await prisma.quizQuestion.upsert({
    where: { id: "q2" },
    update: {},
    create: {
      id: "q2",
      questionText: "How do you prefer to stay informed?",
      questionType: "MULTIPLE_CHOICE",
      order: 2,
    },
  });

  const q2Options = [
    { text: "Quick daily summary of the biggest stories", mappings: { [topicsBySlug["us-policy"]]: 3 } },
    { text: "Deep coverage on a few topics I care about", mappings: {} },
    { text: "Broad coverage across many topics", mappings: Object.fromEntries(Object.values(topicsBySlug).map(id => [id, 2])) },
    { text: "Focus on local and state-level policy", mappings: { [topicsBySlug["us-policy"]]: 4, [topicsBySlug["infrastructure"]]: 3 } },
  ];

  for (let i = 0; i < q2Options.length; i++) {
    await prisma.quizOption.upsert({
      where: { id: `q2-o${i + 1}` },
      update: {},
      create: {
        id: `q2-o${i + 1}`,
        questionId: q2.id,
        optionText: q2Options[i].text,
        topicMappings: q2Options[i].mappings,
        order: i + 1,
      },
    });
  }

  // Question 3
  const q3 = await prisma.quizQuestion.upsert({
    where: { id: "q3" },
    update: {},
    create: {
      id: "q3",
      questionText: "Which statement best describes you?",
      questionType: "MULTIPLE_CHOICE",
      order: 3,
    },
  });

  const q3Options = [
    { text: "I follow politics closely and want nuanced analysis", mappings: { [topicsBySlug["us-policy"]]: 4, [topicsBySlug["foreign-policy"]]: 3 } },
    { text: "I want to stay informed but do not follow politics daily", mappings: { [topicsBySlug["us-policy"]]: 2 } },
    { text: "I am just starting to pay more attention to the news", mappings: {} },
    { text: "I have specific professional interests in policy areas", mappings: {} },
  ];

  for (let i = 0; i < q3Options.length; i++) {
    await prisma.quizOption.upsert({
      where: { id: `q3-o${i + 1}` },
      update: {},
      create: {
        id: `q3-o${i + 1}`,
        questionId: q3.id,
        optionText: q3Options[i].text,
        topicMappings: q3Options[i].mappings,
        order: i + 1,
      },
    });
  }

  // Question 4
  const q4 = await prisma.quizQuestion.upsert({
    where: { id: "q4" },
    update: {},
    create: {
      id: "q4",
      questionText: "Are there specific policy areas you want to track closely?",
      questionType: "MULTIPLE_CHOICE",
      order: 4,
    },
  });

  const q4Options = [
    { text: "Federal legislation and bills", mappings: { [topicsBySlug["us-policy"]]: 5 } },
    { text: "Supreme Court decisions", mappings: { [topicsBySlug["civil-rights"]]: 4, [topicsBySlug["us-policy"]]: 3 } },
    { text: "Executive orders and agency actions", mappings: { [topicsBySlug["us-policy"]]: 5 } },
    { text: "Drug pricing and pharmaceutical regulation", mappings: { [topicsBySlug["healthcare"]]: 5 } },
    { text: "AI regulation and tech policy", mappings: { [topicsBySlug["ai-tech"]]: 5 } },
    { text: "Climate and energy policy", mappings: { [topicsBySlug["environment"]]: 5 } },
    { text: "Defense and military spending", mappings: { [topicsBySlug["national-security"]]: 5 } },
    { text: "Tax policy", mappings: { [topicsBySlug["economy"]]: 5, [topicsBySlug["us-policy"]]: 2 } },
    { text: "Trade and tariffs", mappings: { [topicsBySlug["economy"]]: 4, [topicsBySlug["foreign-policy"]]: 3 } },
  ];

  for (let i = 0; i < q4Options.length; i++) {
    await prisma.quizOption.upsert({
      where: { id: `q4-o${i + 1}` },
      update: {},
      create: {
        id: `q4-o${i + 1}`,
        questionId: q4.id,
        optionText: q4Options[i].text,
        topicMappings: q4Options[i].mappings,
        order: i + 1,
      },
    });
  }

  // Question 5
  const q5 = await prisma.quizQuestion.upsert({
    where: { id: "q5" },
    update: {},
    create: {
      id: "q5",
      questionText: "What matters most to you in news coverage?",
      questionType: "MULTIPLE_CHOICE",
      order: 5,
    },
  });

  const q5Options = [
    { text: "Seeing both sides fairly represented", mappings: {} },
    { text: "Understanding the real-world implications", mappings: {} },
    { text: "Getting just the facts without opinion", mappings: {} },
    { text: "Knowing what policy actions are being taken", mappings: { [topicsBySlug["us-policy"]]: 3 } },
  ];

  for (let i = 0; i < q5Options.length; i++) {
    await prisma.quizOption.upsert({
      where: { id: `q5-o${i + 1}` },
      update: {},
      create: {
        id: `q5-o${i + 1}`,
        questionId: q5.id,
        optionText: q5Options[i].text,
        topicMappings: q5Options[i].mappings,
        order: i + 1,
      },
    });
  }

  console.log("Seeded 5 quiz questions with options");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
