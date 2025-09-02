export type LearningModule = {
  title: string;
  type: 'Course' | 'Workshop' | 'Project';
  duration: string;
};

export const learningPaths: Record<string, LearningModule[]> = {
  "Web Development": [
    { title: "Introduction to HTML & CSS", type: "Course", duration: "2 weeks" },
    { title: "JavaScript Fundamentals", type: "Course", duration: "4 weeks" },
    { title: "React for Beginners", type: "Workshop", duration: "1 week" },
    { title: "Build a Portfolio Website", type: "Project", duration: "3 weeks" },
  ],
  "Project Management": [
    { title: "Agile & Scrum Basics", type: "Course", duration: "2 weeks" },
    { title: "Trello for Task Management", type: "Workshop", duration: "3 hours" },
    { title: "Managing a Social Impact Project", type: "Course", duration: "4 weeks" },
    { title: "Plan a Community Event", type: "Project", duration: "3 weeks" },
  ],
  "Communication": [
    { title: "Public Speaking Essentials", type: "Workshop", duration: "1 week" },
    { title: "Effective Team Collaboration", type: "Course", duration: "2 weeks" },
    { title: "Writing for Impact", type: "Course", duration: "3 weeks" },
  ],
  "Problem Solving": [
    { title: "Design Thinking Fundamentals", type: "Course", duration: "4 weeks" },
    { title: "Creative Brainstorming Techniques", type: "Workshop", duration: "4 hours" },
    { title: "Root Cause Analysis", type: "Course", duration: "2 weeks" },
  ],
  "Leadership": [
    { title: "Introduction to Leadership Styles", type: "Course", duration: "2 weeks" },
    { title: "Mentoring and Coaching", type: "Workshop", duration: "1 week" },
    { title: "Leading with Empathy", type: "Course", duration: "3 weeks" },
  ],
  "Entrepreneurship": [
    { title: "Business Model Canvas", type: "Workshop", duration: "1 day" },
    { title: "From Idea to MVP", type: "Course", duration: "6 weeks" },
    { title: "Social Enterprise 101", type: "Course", duration: "4 weeks" },
  ],
  "Default": [
    { title: "Discover Your Strengths", type: "Course", duration: "1 week" },
    { title: "Goal Setting for Success", type: "Workshop", duration: "3 hours" },
    { title: "Effective Communication", type: "Course", duration: "2 weeks" },
  ]
};

export const userPortfolio = {
  name: "Alex Doe",
  bio: "Aspiring social entrepreneur and web developer passionate about using technology for good. Skilled in front-end development and project coordination.",
  skills: ["React", "JavaScript", "HTML/CSS", "Project Management", "Public Speaking"],
  projects: [
    {
      title: "CleanWater Initiative Website",
      description: "Developed a responsive website for a non-profit to raise awareness and funds for clean water projects in developing countries.",
      imageUrl: "https://picsum.photos/600/400?random=1",
      dataAiHint: "water charity"
    },
    {
      title: "Community Garden Planner App",
      description: "A mobile-first web app to help community members organize and manage a local garden, from planting schedules to harvest distribution.",
      imageUrl: "https://picsum.photos/600/400?random=2",
      dataAiHint: "community garden"
    },
    {
      title: "Youth Coding Bootcamp",
      description: "Co-organized and mentored at a week-long coding bootcamp for underprivileged youth, teaching them the basics of web development.",
      imageUrl: "https://picsum.photos/600/400?random=3",
      dataAiHint: "coding bootcamp"
    }
  ],
  certifications: [
    {
      name: "Agile Project Management",
      issuer: "SkillBridge",
      date: "2023-10-15"
    },
    {
      name: "React Basics",
      issuer: "SkillBridge",
      date: "2023-08-22"
    },
    {
      name: "Social Entrepreneurship 101",
      issuer: "SkillBridge",
      date: "2023-05-01"
    }
  ]
};

export const jobOpportunities = [
  {
    title: "Junior Front-End Developer",
    company: "GreenTech Solutions",
    location: "Remote",
    description: "Join our team to build beautiful and intuitive user interfaces for our environmental impact tracking platform. Requires knowledge of React and a passion for sustainability.",
    tags: ["Web Development", "React", "JavaScript"]
  },
  {
    title: "Project Coordinator Intern",
    company: "Unite for Change",
    location: "New York, NY",
    description: "Support our project managers in organizing and executing social campaigns. A great opportunity for someone with strong communication and organizational skills.",
    tags: ["Project Management", "Communication"]
  },
  {
    title: "Community Manager",
    company: "Innovate Hub",
    location: "Remote",
    description: "Engage with our community of young innovators, organize online events, and help create a vibrant, supportive ecosystem for social entrepreneurs.",
    tags: ["Leadership", "Communication", "Entrepreneurship"]
  },
  {
    title: "UX/UI Design Volunteer",
    company: "Health Access Initiative",
    location: "Part-time, Remote",
    description: "Help us design a user-friendly mobile app that connects rural communities with healthcare services. A great portfolio-building project.",
    tags: ["Web Development", "Problem Solving"]
  }
];
