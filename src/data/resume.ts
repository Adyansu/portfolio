/**
 * Single source of truth for all portfolio content.
 * Every section of the site reads from here, so edit text in one place.
 */

export type Link = { label: string; href: string };

export type Experience = {
  company: string;
  role: string;
  period: string;
  points: string[];
  tags: string[];
};

export type ProjectCategory = "Web" | "Systems" | "AI/ML" | "Graphics";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  period?: string;
  category: ProjectCategory;
  featured?: boolean;
  summary: string;
  points: string[];
  stack: string[];
  github?: string;
  live?: string;
};

export type Achievement = { title: string; detail: string; metric: string };

export type Education = {
  degree: string;
  institute: string;
  period: string;
  score: string;
};

export const profile = {
  name: "Adyansu Beura",
  initials: "AB",
  role: "Frontend Engineer",
  tagline:
    "Final-year Electrical Engineering undergrad at IIT Kanpur building precise, performant interfaces, from full-stack web apps to real-time 3D graphics.",
  location: "IIT Kanpur, India",
  email: "adyansu.beura2020@gmail.com",
  photo: "/images/adyansu.jpg",
  resume: "/Adyansu_Beura_Resume.pdf",
  socials: {
    github: "https://github.com/Adyansu",
    linkedin: "", // TODO: add LinkedIn profile URL
  },
} as const;

/** Cycling line under the name in the hero. */
export const heroRoles = [
  "Frontend Engineer",
  "Full-stack builder",
  "3D graphics tinkerer",
  "Interaction design nerd",
];

export const aboutStats = [
  { value: "Qualcomm", label: "Engineering intern, 2026" },
  { value: "8.6", label: "CPI at IIT Kanpur" },
  { value: "AIR 4", label: "NEST 2023, of 44,500+" },
];

export const aboutBio = [
  "I'm a final-year Electrical Engineering student at IIT Kanpur who loves building things people can see and touch on a screen. My work spans a real-time 3D renderer written from scratch in C++ and OpenGL to Eventrix, a full-stack MERN platform for campus events.",
  "At Qualcomm I worked on backend services and performance analysis for tools handling large-scale design data. It taught me to care about what happens after the click: fast data retrieval, lean requests, and interfaces that stay responsive under load.",
];

export const navLinks: Link[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Playground", href: "#playground" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const education: Education[] = [
  {
    degree: "B.Tech, Electrical Engineering",
    institute: "Indian Institute of Technology Kanpur",
    period: "2023 – Present",
    score: "8.6 / 10 CPI",
  },
  {
    degree: "CBSE (XII)",
    institute: "D.A.V. Public School, Kalinga Nagar",
    period: "2023",
    score: "98.6%",
  },
  {
    degree: "CBSE (X)",
    institute: "D.A.V. Public School, Kalinga Nagar",
    period: "2021",
    score: "98.4%",
  },
];

export const experience: Experience[] = [
  {
    company: "Qualcomm",
    role: "Interim Engineering Intern",
    period: "May '26 – Jul '26",
    points: [
      "Worked on backend services and data-handling workflows supporting concurrent users and large-scale physical-design data, with scalable APIs and database interactions.",
      "Analyzed web application scalability and performance: data retrieval, request processing, resource utilization, and behavior under increasing load.",
      "Built an automated NDR compliance checker for clock networks, parsing design data to verify rule application and improve validation consistency.",
      "Developed automation scripts for delay analysis of FT nets, extracting physical-design data and computing delay metrics to cut manual inspection.",
      "Executed physical design flows in Cadence Innovus across floorplanning, placement, routing, and CTS on large real-world designs.",
    ],
    tags: ["Backend APIs", "Performance", "Automation", "Python", "TCL"],
  },
];

export const projects: Project[] = [
  {
    slug: "eventrix",
    title: "Eventrix",
    subtitle: "Full-stack event management platform",
    category: "Web",
    featured: true,
    summary:
      "A MERN platform where students discover and register for university events through one centralized portal.",
    points: [
      "Secure RESTful APIs with JWT authentication and role-based access control.",
      "Distinct workflows and personalized dashboards for students and administrators.",
      "Integrated payment processing and real-time notifications in a responsive, user-friendly interface.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "REST"],
    github: "https://github.com/Adyansu/Eventrix",
  },
  {
    slug: "spicelite",
    title: "SpiceLite",
    subtitle: "C++ circuit simulation engine",
    category: "Systems",
    featured: true,
    summary:
      "A modular, terminal-based circuit simulator in C++17, from netlist parsing to DC, transient, and AC analysis.",
    points: [
      "SPICE-inspired netlist parser supporting elements, suffixes, directives, and AC sources.",
      "Object-oriented architecture separating components, parsing, solvers, workflows, and output.",
      "Reproducible workflow with CMake, vcpkg, and CTest regression suites.",
    ],
    stack: ["C++17", "CMake", "vcpkg", "CTest"],
    github: "https://github.com/Adyansu/SpiceLite",
  },
  {
    slug: "3d-renderer",
    title: "Graphics & Shaders",
    subtitle: "Real-time 3D renderer from scratch",
    period: "Dec '24 – Mar '25",
    category: "Graphics",
    featured: true,
    summary:
      "A real-time 3D engine in C++ and OpenGL implementing the full rendering pipeline for interactive scenes.",
    points: [
      "Programmable vertex and fragment shaders with Phong lighting and texture mapping.",
      "Reusable abstractions for scene objects, cameras, lights, and render components.",
    ],
    stack: ["C++", "OpenGL", "GLSL", "GLFW", "GLAD"],
  },
  {
    slug: "multimodal-sentiment",
    title: "Multimodal Sentiment Analysis",
    subtitle: "Meme sentiment, humor & offense detection",
    period: "Dec '24 – Mar '25",
    category: "AI/ML",
    summary:
      "A transformer system fusing BERT text embeddings and ViT image features to classify memes.",
    points: [
      "82.3% F1-score, 12% above unimodal baselines.",
      "Inference latency under 500 ms through quantization and optimization.",
      "Generalized to IMDB sentiment with 78% accuracy.",
    ],
    stack: ["PyTorch", "BERT", "ViT", "Hugging Face"],
  },
  {
    slug: "predator-prey",
    title: "Predator–Prey Arena",
    subtitle: "Reinforcement learning on a stochastic MDP",
    period: "Mar '25 – Apr '25",
    category: "AI/ML",
    summary:
      "An MDP with N⁴ states and 5 actions, solved with value/policy iteration and a neural REINFORCE policy.",
    points: [
      "Transition-kernel estimation handling dense and sparse matrices at scale.",
      "REINFORCE with gradient clipping and advantage normalization; compared SGD vs Adam.",
    ],
    stack: ["Python", "NumPy", "PyTorch"],
  },
  {
    slug: "llm",
    title: "Large Language Models",
    subtitle: "CS781 coursework · ongoing",
    period: "Aug '26 – ongoing",
    category: "AI/ML",
    summary:
      "Hands-on Transformer LMs, PEFT (LoRA), RAG, quantization, RLHF, and agentic systems.",
    points: [
      "Practical LLM pipelines optimizing adaptation and inference efficiency.",
      "Experiments with prompting strategies, agents, and multimodal LMs.",
    ],
    stack: ["PyTorch", "LangChain", "Hugging Face"],
  },
];

export const skills = {
  Frontend: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML/CSS"],
  Backend: ["Node.js", "Express", "MongoDB", "REST APIs", "JWT"],
  Languages: ["C++", "C", "Python", "Bash", "TCL", "Verilog HDL"],
  Graphics: ["OpenGL", "GLSL", "Three.js", "Unity"],
  "AI / ML": ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "LangChain", "Hugging Face"],
  Tools: ["Git & GitHub", "Postman", "CMake", "Cadence Innovus", "LaTeX"],
} as const;

export const achievements: Achievement[] = [
  {
    metric: "AIR 1277",
    title: "JEE Advanced 2023",
    detail: "All India Rank in India's toughest engineering entrance exam.",
  },
  {
    metric: "AIR 1289",
    title: "JEE Main 2023",
    detail: "All India Rank in the national engineering entrance exam.",
  },
  {
    metric: "AIR 4",
    title: "NEST 2023",
    detail: "All India Rank 4 among 44,500+ applicants.",
  },
  {
    metric: "AIR 1034",
    title: "KVPY 2021 (SA)",
    detail: "Kishore Vaigyanik Protsahan Yojana, conducted by IISc Bangalore.",
  },
  {
    metric: "NTSE",
    title: "National Talent Search Scholar",
    detail: "Scholarship funded by the Government of India.",
  },
  {
    metric: "Rank 24",
    title: "Junior Mathematics Olympiad 2018",
    detail: "All Odisha Rank, Odisha Mathematical Society.",
  },
];

export const extracurriculars: string[] = [
  "2nd place, Football, representing Pool Nawabs at Inferno '24",
  "2nd place, Institute Cricket Championship",
  "Elected Maintenance Secretary, Hall 1, IIT Kanpur",
];

export const courses: string[] = [
  "Data Structures and Algorithms",
  "Interaction Design in Complex Systems",
  "Fundamentals of Computing",
  "Large Language Models",
  "Machine Learning for Signal Processing",
  "Introduction to Reinforcement Learning",
  "Probability and Statistics",
  "Digital Electronics",
];
