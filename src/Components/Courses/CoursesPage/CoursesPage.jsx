import { useEffect, useRef, useState } from "react";
import "./CoursesPage.css";

/* =====================================================================
   CoursePage.jsx – the page of a single course
   Rendered by ExploreOurCourses.jsx when a course card is clicked.

   Props
     course    one object from the `courses` array in ExploreOurCourses.jsx
     art       the course artwork (SVG string)
     backHref  where "Back to all courses" goes (default "#/")
     courses   all courses (used for "Recommended courses")
     artOf     function: course id -> artwork SVG string

   File layout
     1. CONTENT   – all the text on the page (edit this block)
     2. HELPERS   – small utilities
     3. PAGE      – CoursePage and the sections it is built from
     4. CHECKOUT  – the buy dialog (demo only, no real payment)

   All text is placeholder content: replace it with your own.
   ===================================================================== */


/* =====================================================================
   1. CONTENT
   ===================================================================== */

/* Per-course content. The key must match `course.art` in ExploreOurCourses.jsx. */
const CONTENT = {
  brain: {
    about: "Understand how machines learn from data. You will start from the core ideas of AI and finish with working models you can show in a portfolio.",
    overview: "The course moves step by step: concepts first, then code, then a project. You will learn how models are trained, tested and improved, and where AI fits into real products.",
    learn: [
      "Core AI and machine learning concepts",
      "Python for data and models",
      "Training and testing ML models",
      "Neural network basics",
      "Working with real datasets",
      "Building a mini AI project",
    ],
    skills: [
      "Machine Learning",
      "Python",
      "Neural Networks",
      "Model Evaluation",
      "Data Preprocessing",
      "Deep Learning",
      "Problem Solving",
      "AI Ethics",
    ],
    tools: ["Python", "Jupyter", "NumPy", "Scikit-learn", "TensorFlow"],
    audience: [
      "Beginners curious about AI",
      "Students planning a tech career",
      "Developers adding ML to their skills",
    ],
    requirements: [
      "Basic computer skills",
      "No coding experience needed, Python is taught from the start",
    ],
    roles: ["AI Engineer", "Machine Learning Intern", "Data Analyst", "Research Assistant"],
    modules: [
      { title: "Introduction to AI", desc: "What AI is, where it is used and how it differs from ML." },
      { title: "Python and data basics", desc: "NumPy, Pandas and preparing data for models." },
      { title: "Machine learning models", desc: "Regression, classification and model evaluation." },
      { title: "Neural networks", desc: "Layers, training and common architectures." },
      { title: "Capstone project", desc: "Build and present your own AI application." },
    ],
    projects: [
      { title: "Spam detector", desc: "Classify messages with a trained model" },
      { title: "House price predictor", desc: "Predict values from real data" },
      { title: "Image classifier", desc: "Recognise objects with a neural network" },
    ],
    enrolled: "12,480",
    reviewCount: "2,310",
  },
  laptop: {
    about: "Build complete web applications from the interface to the database. Every module ends with a project that goes into your portfolio.",
    overview: "You will build the same way professionals do: design the interface, create the server, connect a database and put it online. Each module adds one layer to a growing project.",
    learn: [
      "Responsive HTML, CSS and JavaScript",
      "React for modern interfaces",
      "Node.js and REST APIs",
      "Databases with SQL and MongoDB",
      "Authentication and security basics",
      "Deploying a live website",
    ],
    skills: [
      "HTML & CSS",
      "JavaScript",
      "React",
      "Node.js",
      "REST APIs",
      "SQL",
      "MongoDB",
      "Git",
      "Deployment",
    ],
    tools: ["VS Code", "React", "Node.js", "Express", "MongoDB", "Git"],
    audience: [
      "Aspiring web developers",
      "Students and graduates entering IT",
      "Freelancers building client sites",
    ],
    requirements: ["Basic HTML and logic helps", "A laptop with internet access"],
    roles: [
      "Full Stack Developer",
      "Front-end Developer",
      "Back-end Developer",
      "Freelance Web Developer",
    ],
    modules: [
      { title: "Front-end foundations", desc: "HTML, CSS, Flexbox, Grid and JavaScript essentials." },
      { title: "React", desc: "Components, state, hooks and routing." },
      { title: "Back-end with Node", desc: "Express, REST APIs and middleware." },
      { title: "Databases", desc: "Designing schemas, queries and connecting to your API." },
      { title: "Deployment and final project", desc: "Ship a full stack app to the web." },
    ],
    projects: [
      { title: "Portfolio site", desc: "A responsive personal website" },
      { title: "Task manager app", desc: "React front end with a Node API" },
      { title: "Full stack store", desc: "Login, products, cart and database" },
    ],
    enrolled: "18,920",
    reviewCount: "3,540",
  },
  data: {
    about: "Learn to turn raw data into decisions. This course covers cleaning, analysis and visual storytelling with tools used by working analysts.",
    overview: "Work with messy, real-world data and learn to answer business questions with it. You will practise cleaning, analysing and presenting results in a way that decision makers understand.",
    learn: [
      "Data cleaning with Pandas",
      "Exploratory data analysis",
      "Charts and dashboards",
      "Statistics for analysts",
      "SQL for reporting",
      "Presenting insights clearly",
    ],
    skills: [
      "Data Visualization",
      "Data Wrangling",
      "SQL",
      "Statistics",
      "Dashboard Creation",
      "Data Storytelling",
      "Model Evaluation",
      "Data Presentation",
    ],
    tools: ["Python", "Pandas", "Matplotlib", "SQL", "Excel"],
    audience: [
      "Aspiring data analysts",
      "Business students",
      "Professionals working with spreadsheets",
    ],
    requirements: ["Basic Excel or Python is helpful", "Comfort with numbers"],
    roles: ["Data Analyst", "Business Analyst", "Data Science Intern", "Reporting Analyst"],
    modules: [
      { title: "Data foundations", desc: "Data types, sources and spreadsheets to Python." },
      { title: "Cleaning and wrangling", desc: "Missing values, merging and reshaping data." },
      { title: "Statistics", desc: "Distributions, hypothesis tests and correlation." },
      { title: "Visualization", desc: "Matplotlib, Seaborn and dashboards." },
      { title: "Case study", desc: "Analyse a real-world dataset end to end." },
    ],
    projects: [
      { title: "Sales dashboard", desc: "Charts and KPIs from raw sales data" },
      { title: "Survey analysis", desc: "Clean and summarise real responses" },
      { title: "Final case study", desc: "Insights report for a real dataset" },
    ],
    enrolled: "9,860",
    reviewCount: "1,720",
  },
  lens: {
    about: "Teach computers to see. Work with images and video to detect, classify and track objects using modern computer vision tools.",
    overview: "Go from how images are stored to systems that detect and track objects. Each module pairs a short concept lesson with code you run on your own images and videos.",
    learn: [
      "Image processing with OpenCV",
      "Image classification",
      "Object detection",
      "Face and feature detection",
      "Working with video streams",
      "Deploying a vision model",
    ],
    skills: [
      "Image Processing",
      "Object Detection",
      "Image Classification",
      "Deep Learning",
      "Video Analysis",
      "Feature Detection",
      "Model Deployment",
    ],
    tools: ["Python", "OpenCV", "TensorFlow", "Jupyter", "NumPy"],
    audience: [
      "Python learners moving into AI",
      "Engineering students",
      "Developers working with images",
    ],
    requirements: ["Basic Python", "Some familiarity with ML helps"],
    roles: ["Computer Vision Engineer", "ML Engineer", "Research Assistant", "AI Developer"],
    modules: [
      { title: "Image basics", desc: "Pixels, colour spaces, filters and transformations." },
      { title: "Classic vision", desc: "Edges, contours and feature matching." },
      { title: "Deep learning for images", desc: "CNNs and transfer learning." },
      { title: "Detection and tracking", desc: "Detect and follow objects in video." },
      { title: "Project", desc: "Build a working vision application." },
    ],
    projects: [
      { title: "Face detector", desc: "Find faces in photos and video" },
      { title: "Object counter", desc: "Detect and count items in a scene" },
      { title: "Plate reader", desc: "Read text from number plates" },
    ],
    enrolled: "5,240",
    reviewCount: "880",
  },
  gen: {
    about: "Build applications powered by generative AI. Learn prompting, working with language models and shipping useful AI features.",
    overview: "Learn how modern language models work and how to build features on top of them. You will move from writing good prompts to shipping small apps that use AI in a reliable way.",
    learn: [
      "How large language models work",
      "Effective prompt writing",
      "Building chatbots and assistants",
      "Using AI APIs in apps",
      "Retrieval from your own documents",
      "Responsible AI use",
    ],
    skills: [
      "Prompt Engineering",
      "Large Language Models",
      "Chatbot Development",
      "API Integration",
      "Retrieval Techniques",
      "Responsible AI",
      "Python",
    ],
    tools: ["Python", "LLM APIs", "Vector Search", "Streamlit", "Git"],
    audience: [
      "Beginners exploring AI tools",
      "Developers adding AI features",
      "Creators automating their work",
    ],
    requirements: ["Basic Python is helpful", "Curiosity about AI tools"],
    roles: [
      "Generative AI Developer",
      "Prompt Engineer",
      "AI Product Builder",
      "Automation Specialist",
    ],
    modules: [
      { title: "Generative AI overview", desc: "Models, capabilities and limits." },
      { title: "Prompt engineering", desc: "Patterns for reliable, high-quality outputs." },
      { title: "Building with APIs", desc: "Connect a language model to your own app." },
      { title: "Documents and search", desc: "Ground answers in your own data." },
      { title: "Final project", desc: "Launch your own AI-powered tool." },
    ],
    projects: [
      { title: "Study chatbot", desc: "Answers questions from your notes" },
      { title: "Content assistant", desc: "Drafts and edits text with an LLM" },
      { title: "Document Q&A", desc: "Search and answer over PDFs" },
    ],
    enrolled: "14,300",
    reviewCount: "2,050",
  },
  cloud: {
    about: "Learn to deploy and run applications in the cloud. Get hands-on with servers, containers and scaling.",
    overview: "Understand how applications run on the cloud and how teams ship them safely. You will package an app, automate its deployment and learn how to keep it running as traffic grows.",
    learn: [
      "Cloud concepts and services",
      "Virtual machines and storage",
      "Containers with Docker",
      "Deploying scalable apps",
      "Basic CI/CD pipelines",
      "Monitoring and cost basics",
    ],
    skills: [
      "Cloud Architecture",
      "Containers",
      "Docker",
      "Deployment",
      "CI/CD",
      "Scalability",
      "Monitoring",
      "Linux Basics",
    ],
    tools: ["Docker", "Linux", "Git", "CI/CD pipelines", "Cloud console"],
    audience: ["Developers deploying apps", "IT students", "System admins moving to the cloud"],
    requirements: ["Basic Linux commands", "Some programming experience"],
    roles: [
      "Cloud Engineer",
      "DevOps Engineer",
      "Site Reliability Intern",
      "Systems Administrator",
    ],
    modules: [
      { title: "Cloud fundamentals", desc: "Models of cloud, regions and core services." },
      { title: "Compute and storage", desc: "Servers, buckets and databases." },
      { title: "Containers", desc: "Docker images and running containers." },
      { title: "Deployment", desc: "Load balancing, scaling and pipelines." },
      { title: "Project", desc: "Deploy a real app to the cloud." },
    ],
    projects: [
      { title: "Containerised app", desc: "Package an app with Docker" },
      { title: "Pipeline", desc: "Automatic build and deploy on every push" },
      { title: "Scalable site", desc: "Deploy with load balancing" },
    ],
    enrolled: "6,150",
    reviewCount: "960",
  },
  shield: {
    about: "Understand how systems are attacked and how to defend them. A practical start for anyone entering security.",
    overview: "See systems the way an attacker does, then learn how to protect them. Hands-on labs let you practise safely, so every concept is something you have actually tried.",
    learn: [
      "Networking and security basics",
      "Common threats and attacks",
      "Passwords, encryption and access",
      "Secure system setup",
      "Introduction to ethical hacking",
      "Incident response basics",
    ],
    skills: [
      "Network Security",
      "Threat Analysis",
      "Encryption",
      "Access Control",
      "Ethical Hacking",
      "Incident Response",
      "Risk Awareness",
    ],
    tools: ["Wireshark", "Kali Linux", "Nmap", "Linux", "Firewalls"],
    audience: ["Beginners entering security", "IT support staff", "Students and career switchers"],
    requirements: ["Basic networking knowledge helps", "Willingness to practise in labs"],
    roles: [
      "Security Analyst",
      "SOC Analyst",
      "Penetration Testing Intern",
      "IT Support Specialist",
    ],
    modules: [
      { title: "Security basics", desc: "Confidentiality, integrity and availability." },
      { title: "Networks", desc: "How data moves and where it is exposed." },
      { title: "Threats and attacks", desc: "Phishing, malware and web attacks." },
      { title: "Defence", desc: "Firewalls, encryption and hardening." },
      { title: "Hands-on lab", desc: "Find and fix weaknesses in a practice system." },
    ],
    projects: [
      { title: "Network scan", desc: "Map devices and open ports in a lab" },
      { title: "Password audit", desc: "Test and strengthen weak credentials" },
      { title: "Hardening checklist", desc: "Secure a practice server" },
    ],
    enrolled: "7,430",
    reviewCount: "1,190",
  },
  python: {
    about: "Learn Python from scratch and grow to advanced topics. Ideal if you are new to coding or want a strong base for AI and web development.",
    overview: "Start from the very first line of code and build up to real programs. Short lessons, plenty of exercises and three projects make the concepts stick.",
    learn: [
      "Python syntax and logic",
      "Functions and modules",
      "Working with files and data",
      "Object-oriented programming",
      "Writing clean, tested code",
      "Building small projects",
    ],
    skills: [
      "Python",
      "Problem Solving",
      "Object-Oriented Programming",
      "File Handling",
      "Debugging",
      "Automation",
      "Data Structures",
    ],
    tools: ["Python", "VS Code", "Jupyter", "Git", "pip"],
    audience: ["Complete beginners", "Students", "Anyone who wants to automate tasks"],
    requirements: ["None, you can start from zero"],
    roles: [
      "Python Developer",
      "Automation Engineer",
      "Junior Software Developer",
      "Data Analyst",
    ],
    modules: [
      { title: "Getting started", desc: "Install Python, variables and data types." },
      { title: "Control flow", desc: "Conditions, loops and functions." },
      { title: "Data structures", desc: "Lists, dictionaries, sets and tuples." },
      { title: "Object-oriented Python", desc: "Classes, inheritance and modules." },
      { title: "Projects", desc: "Apply everything in three practical builds." },
    ],
    projects: [
      { title: "Calculator", desc: "A command-line tool" },
      { title: "Expense tracker", desc: "Save and analyse data in files" },
      { title: "Mini game", desc: "Practise logic and classes" },
    ],
    enrolled: "22,700",
    reviewCount: "4,610",
  },
};

const TESTIMONIALS = [
  { quote: "The projects made the difference. I could show real work in my interviews.", author: "Student" },
  { quote: "Clear lessons, no filler. I went from beginner to building on my own.", author: "Career switcher" },
  { quote: "The doubt-clearing support kept me moving when I got stuck.", author: "Working professional" },
  { quote: "I finished with a portfolio and the confidence to apply for roles.", author: "Final-year student" },
];

const REVIEWS = [
  { stars: 5, text: "Well structured and practical. Every module had something to build.", author: "Learner" },
  { stars: 5, text: "Explained simply, even the difficult parts. Worth the price.", author: "Learner" },
  { stars: 4, text: "Good pace and good projects. I would like even more practice questions.", author: "Learner" },
];

/* Share of reviews for 5, 4, 3, 2 and 1 stars (percent) */
const RATING_SPREAD = [72, 18, 6, 3, 1];

const SUPPORT_CARDS = [
  { title: "ProJenius Expert Team", desc: "Industry practitioners who design and teach the course" },
  { title: "Mentor support", desc: "Doubt-clearing help while you learn" },
  { title: "Project review", desc: "Feedback on your projects before you finish" },
];

/* Which courses to recommend on each course page (ids = course.art) */
const RECOMMENDED = {
  brain: ["gen", "lens", "python"],
  laptop: ["cloud", "python", "shield"],
  data: ["brain", "python", "gen"],
  lens: ["brain", "gen", "python"],
  gen: ["brain", "python", "lens"],
  cloud: ["laptop", "shield", "python"],
  shield: ["cloud", "laptop", "python"],
  python: ["brain", "laptop", "data"],
};

/* "Need to talk to an expert?" – PLACEHOLDER phone: replace with your real number */
const EXPERT = {
  phone: "+910000000000",      // used for the "Call us" button
  whatsapp: "918925450473",    // country code + number, no "+" or spaces
  hours: "Mon – Sat, 9 AM – 7 PM",
};

const TABS = [
  ["about", "About"],
  ["outcomes", "Outcomes"],
  ["modules", "Modules"],
  ["projects", "Projects"],
  ["instructors", "Instructors"],
  ["testimonials", "Testimonials"],
  ["reviews", "Reviews"],
  ["faq", "FAQ"],
];

const CERTIFICATE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/></svg>';


/* =====================================================================
   2. HELPERS
   ===================================================================== */

const inr = (value) => "₹" + value.toLocaleString("en-IN");

/* course.desc looks like "Practical learning · Beginner" */
const levelOf = (course) => course.desc.split("·")[1].trim();

/* Renders an HTML/SVG string (used for the artwork and icons) */
const Html = ({ h, as: Tag = "span", ...props }) => (
  <Tag {...props} dangerouslySetInnerHTML={{ __html: h }} />
);

/* Returns the id of the section currently being read (drives the active tab) */
function useActiveSection(initial = "about") {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("sec-", ""))),
      { rootMargin: "-25% 0px -65% 0px" }
    );
    document.querySelectorAll(".sec").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}


/* =====================================================================
   3. PAGE
   ===================================================================== */

export default function CoursePage({ course, art, backHref = "#/", courses = [], artOf = () => "" }) {
  const content = CONTENT[course.art];
  const level = levelOf(course);
  const active = useActiveSection();
  const [buying, setBuying] = useState(false);
  const openCheckout = () => setBuying(true);
  const picks = (RECOMMENDED[course.art] || []).map((id) => courses.find((c) => c.art === id)).filter(Boolean);

  useEffect(() => {
    document.title = `${course.title} – ProJenius Technology`;
    window.scrollTo(0, 0);
  }, [course.title]);

  return (
    <main className="cpage" data-course={course.art}>
      <a className="back" href={backHref}>‹ Back to all courses</a>

      <Hero course={course} content={content} art={art} onEnroll={openCheckout} />
      <Facts course={course} content={content} level={level} />

      <div className="cbody">
        <div className="lcol">
          <Tabs active={active} />
          <AboutSection content={content} />
          <OutcomesSection content={content} />
          <ModulesSection course={course} content={content} />
          <ProjectsSection content={content} />
          <InstructorsSection />
          <TestimonialsSection />
          <ReviewsSection course={course} content={content} />
          <FaqSection course={course} level={level} />
        </div>

        <BuyPanel course={course} art={art} onBuy={openCheckout} />
      </div>

      <div className="after">
        <Recommended picks={picks} artOf={artOf} />
        <ExpertHelp course={course} />
      </div>

      <Checkout course={buying ? course : null} onClose={() => setBuying(false)} />
    </main>
  );
}

/* ---------- Top of the page ---------- */

function Hero({ course, content, art, onEnroll }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">{course.cat}</p>
        <h1 className="ctitle">{course.title}</h1>
        <p className="lead">{content.about}</p>

        <div className="insts">
          <span className="avs">
            <i className="av">PJ</i><i className="av">EX</i><i className="av">+5</i>
          </span>
          <span>Instructors: <b>ProJenius Expert Team</b></span>
        </div>

        <button className="cta" onClick={onEnroll}>Enroll now · {inr(course.price)}</button>
        <p className="enr"><b>{content.enrolled}</b> already enrolled</p>
      </div>

      <Html as="div" className="hart" h={`<div class="art-wrap">${art}</div>`} />
    </section>
  );
}

function Facts({ course, content, level }) {
  const beginner = level === "Beginner";
  return (
    <section className="facts" aria-label="Course summary">
      <div className="fact">
        <b>{content.modules.length} modules</b>
        <span>{course.lessons} lessons with hands-on projects</span>
      </div>
      <div className="fact">
        <b>{course.rating} ★</b>
        <span>from {content.reviewCount} reviews of this course</span>
      </div>
      <div className="fact">
        <b>{level} level</b>
        <span>{beginner ? "No prior experience required" : "Some basics recommended"}</span>
      </div>
      <div className="fact">
        <b>Flexible schedule</b>
        <span>{course.weeks} weeks · learn at your own pace</span>
      </div>
    </section>
  );
}

function Tabs({ active }) {
  const scrollTo = (id) =>
    document.getElementById("sec-" + id).scrollIntoView({ behavior: "smooth" });

  return (
    <nav className="tabs" aria-label="Sections">
      {TABS.map(([id, label]) => (
        <button key={id} className={active === id ? "on" : ""} onClick={() => scrollTo(id)}>
          {label}
        </button>
      ))}
    </nav>
  );
}

/* ---------- Reusable pieces ---------- */

const Section = ({ id, children }) => (
  <section className="sec" id={"sec-" + id}>{children}</section>
);

const CheckList = ({ items }) => (
  <ul className="learn">
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>
);

const Chips = ({ items }) => (
  <div className="skills">
    {items.map((item) => <span className="skill" key={item}>{item}</span>)}
  </div>
);

const CardGrid = ({ items }) => (
  <div className="cards3">
    {items.map(({ title, desc }) => (
      <div className="pcard" key={title}><b>{title}</b><span>{desc}</span></div>
    ))}
  </div>
);

const Accordion = ({ title, open, children }) => (
  <details className="mod" open={open}>
    <summary>{title}</summary>
    <p>{children}</p>
  </details>
);

/* ---------- Content sections ---------- */

function AboutSection({ content }) {
  return (
    <Section id="about">
      <h3>About this course</h3>
      <p className="about">{content.about} {content.overview}</p>

      <h3>What you'll learn</h3>
      <CheckList items={content.learn} />

      <h3>Skills you'll gain</h3>
      <Chips items={content.skills} />

      <h3>Tools you'll learn</h3>
      <Chips items={content.tools} />

      <h3>Who this course is for</h3>
      <CheckList items={content.audience} />

      <h3>Requirements</h3>
      <CheckList items={content.requirements} />
    </Section>
  );
}

function OutcomesSection({ content }) {
  return (
    <Section id="outcomes">
      <h3>Career outcomes</h3>
      <CheckList items={content.roles} />

      <div className="cert">
        <Html h={CERTIFICATE_ICON} />
        <div>
          <b>Earn a certificate</b><br />
          Complete the modules and projects to receive a ProJenius certificate you can add to your resume and LinkedIn profile.
        </div>
      </div>
    </Section>
  );
}

function ModulesSection({ course, content }) {
  return (
    <Section id="modules">
      <h3>
        Course modules{" "}
        <span className="subnote">
          · {content.modules.length} modules · {course.lessons} lessons · {course.weeks} weeks
        </span>
      </h3>
      {content.modules.map(({ title, desc }, i) => (
        <Accordion key={title} title={`Module ${i + 1}: ${title}`} open={i === 0 || undefined}>
          {desc}<br /><br />Includes video lessons, practice exercises and a short quiz.
        </Accordion>
      ))}
    </Section>
  );
}

function ProjectsSection({ content }) {
  return (
    <Section id="projects">
      <h3>Projects you'll build</h3>
      <CardGrid items={content.projects} />
    </Section>
  );
}

function InstructorsSection() {
  return (
    <Section id="instructors">
      <h3>Instructors and support</h3>
      <CardGrid items={SUPPORT_CARDS} />
    </Section>
  );
}

function TestimonialsSection() {
  return (
    <Section id="testimonials">
      <h3>Testimonials</h3>
      <div className="quotes">
        {TESTIMONIALS.map(({ quote, author }) => (
          <blockquote className="quote" key={quote}>{quote}<cite>{author}</cite></blockquote>
        ))}
      </div>
    </Section>
  );
}

function ReviewsSection({ course, content }) {
  return (
    <Section id="reviews">
      <h3>Reviews</h3>

      <div className="rv">
        <div>
          <div className="big">{course.rating}</div>
          <small>{content.reviewCount} reviews</small>
        </div>
        <div className="bars">
          {RATING_SPREAD.map((percent, i) => (
            <div className="bar" key={i}>
              <span>{5 - i} star</span>
              <i style={{ "--w": percent + "%" }} />
              <span>{percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {REVIEWS.map(({ stars, text, author }) => (
        <div className="rev" key={text}>
          <span className="st" aria-label={`${stars} stars`}>
            {"★".repeat(stars)}{"☆".repeat(5 - stars)}
          </span>
          <br />{text}<cite>{author}</cite>
        </div>
      ))}
    </Section>
  );
}

function FaqSection({ course, level }) {
  const faqs = [
    [
      "Do I need prior experience?",
      level === "Beginner"
        ? "No. The course starts from the basics and builds up."
        : "Some basics help. The first module recaps what you need.",
    ],
    ["How long does the course take?", `About ${course.weeks} weeks at a few hours a week. You can learn at your own pace.`],
    ["Will I get a certificate?", "Yes. You receive a certificate after completing the course and its projects."],
    ["How do I enroll?", "Click Enroll now, fill in your details and complete the payment. Access details come by email."],
    ["Can I revisit the lessons later?", "Yes. You keep access to the course materials after you finish."],
  ];

  return (
    <Section id="faq">
      <h3>Frequently asked questions</h3>
      {faqs.map(([question, answer]) => (
        <Accordion key={question} title={question}>{answer}</Accordion>
      ))}
    </Section>
  );
}

/* ---------- Recommended courses + expert help ---------- */

function Recommended({ picks, artOf }) {
  if (!picks.length) return null;

  return (
    <section className="more" aria-labelledby="reco-title">
      <h2 id="reco-title">Recommended courses</h2>
      <p className="msub">Keep learning with these courses picked for you.</p>

      <div className="reco">
        {picks.map((c) => (
          <a className="rcard" key={c.art} href={`#/course/${c.art}`}>
            <Html as="div" className="rthumb" h={`<div class="art-wrap">${artOf(c.art)}</div>`} />
            <div className="rbody">
              <span className="rcat">{c.cat}</span>
              <h3 className="rtitle">{c.title}</h3>
              <span className="rmeta">★ {c.rating} · {c.weeks} weeks · {levelOf(c)}</span>
              <div className="rfoot">
                <b>{inr(c.price)}</b>
                <span>View course ›</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ExpertHelp({ course }) {
  const question = encodeURIComponent(`Hi, I have a question about ${course.title}`);

  return (
    <section className="more expert" aria-labelledby="expert-title">
      <h2 id="expert-title">Need to talk to an expert?</h2>
      <p className="msub">
        Not sure if {course.title} is right for you? Our course advisors can help you choose,
        explain the syllabus and answer your questions.
      </p>

      <div className="ways">
        <a className="way" href={`tel:${EXPERT.phone}`}>Call us</a>
        <a className="way" href={`https://wa.me/${EXPERT.whatsapp}?text=${question}`} target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
      <p className="hours">Available {EXPERT.hours}</p>
    </section>
  );
}

/* ---------- Buy panel ---------- */

function BuyPanel({ course, art, onBuy }) {
  /* The crossed-out price is just the price + 50%: replace with your real original price */
  const originalPrice = Math.round((course.price * 1.5) / 100) * 100;
  const discount = Math.round((1 - course.price / originalPrice) * 100);

  return (
    <aside className="buy">
      <Html as="div" className="art" h={`<div class="art-wrap">${art}</div>`} />

      <div>
        <span className="now">{inr(course.price)}</span>
        <span className="was">{inr(originalPrice)}</span>
        <span className="off">{discount}% off</span>
      </div>

      <button className="cta" onClick={onBuy}>Buy now</button>

      <ul className="incl">
        <li>{course.weeks} weeks of guided learning</li>
        <li>{course.lessons} lessons with projects</li>
        <li>Certificate on completion</li>
        <li>Lifetime access to materials</li>
      </ul>
    </aside>
  );
}


/* =====================================================================
   4. CHECKOUT DIALOG (demo: no real payment)
   ===================================================================== */

function Checkout({ course, onClose }) {
  const dialogRef = useRef(null);
  const [enrolled, setEnrolled] = useState(null);

  /* open / close the native <dialog> when `course` is set / cleared */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (course) {
      setEnrolled(null);
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [course]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);

    // TODO: call your payment gateway here (e.g. Razorpay or Stripe) before confirming.

    setEnrolled({
      firstName: String(form.get("fname")).split(" ")[0],
      email: String(form.get("email")),
    });
  };

  /* clicking the dark backdrop closes the dialog */
  const handleBackdropClick = (event) => event.target === dialogRef.current && onClose();

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={handleBackdropClick}>
      <button className="x" onClick={onClose} aria-label="Close">×</button>

      {course && !enrolled && (
        <form onSubmit={handleSubmit}>
          <h3>Enroll in {course.title}</h3>
          <p className="sum">Amount payable: <b>{inr(course.price)}</b></p>

          <label>Full name<input name="fname" required autoComplete="name" /></label>
          <label>Email<input type="email" name="email" required autoComplete="email" /></label>
          <label>Phone<input type="tel" name="phone" required pattern="[0-9+ ]{10,14}" autoComplete="tel" /></label>

          <button className="cta" type="submit">Proceed to pay</button>
        </form>
      )}

      {enrolled && (
        <div>
          <h3>You're enrolled, {enrolled.firstName}!</h3>
          <p className="sum">Course access details will be sent to <b>{enrolled.email}</b>.</p>
          <button className="cta" onClick={onClose}>Done</button>
        </div>
      )}
    </dialog>
  );
}