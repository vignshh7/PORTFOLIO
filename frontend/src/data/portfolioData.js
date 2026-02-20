export const portfolioData = {
  site: {
    logoText: "vignesh",
    title: "Vignesh Venkatesan - Data Science & ML Engineer",
  },
  navLinks: [
    { id: "about", label: "about" },
    { id: "projects", label: "projects" },
    { id: "experience", label: "experience" },
    { id: "achievements", label: "achievements" },
    { id: "contact", label: "contact" },
  ],
  hero: {
    name: "Vignesh Venkatesan",
    subtitle: "Data Science & ML Engineer",
    rotatingSubtitles: [
      "Full Stack Developer",
      "Data Analyst",
      "Deep Learning Enthusiast",
      "Coding Enthusiast",
    ],
    description:
      "A passionate data science student specializing in machine learning solutions, transforming complex data into actionable insights through statistical modeling and AI.",
    ctas: [
      { label: "View Work", href: "#projects", variant: "primary" },
      {
        label: "Download Resume",
        href: "/Vignesh-Resume.pdf",
        variant: "secondary",
        download: true,
      },
      { label: "Get in Touch", href: "#contact", variant: "secondary" },
    ],
  },
  about: {
    title: "about me",
    text: [
      "I'm a passionate undergraduate student specializing in Data Science and Machine Learning.",
      "While I gained valuable frontend experience during my internship, my true expertise lies in building predictive models and extracting insights from complex datasets. I'm particularly interested in medical AI applications and deep learning solutions.",
    ],
  },
  education: {
    title: "Education",
    items: [
      {
        period: "2023 - Present",
        institution: "Vellore Institute of Technology, Chennai",
        details: "B.Tech in Computer Science (Data Science) | CGPA: 9.48 (4 Semesters)",
      },
      {
        period: "2017 - 2023",
        institution: "The Navodaya Academy",
        details: "Higher Secondary Education",
      },
    ],
  },
  skills: {
    title: "Technical Skills",
    categories: [
      {
        label: "Languages",
        items: [
          {
            label: "Python",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/python/python-original.svg",
          },
          {
            label: "Java",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/java/java-original.svg",
          },
          {
            label: "C++",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/cplusplus/cplusplus-original.svg",
          },
          {
            label: "C",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/c/c-original.svg",
          },
        ],
      },
      {
        label: "Data Science",
        items: [
          {
            label: "Pandas",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/pandas/pandas-original.svg",
          },
          {
            label: "NumPy",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/numpy/numpy-original.svg",
          },
          {
            label: "Jupyter",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/jupyter/jupyter-original.svg",
          },
        ],
      },
      {
        label: "Machine Learning",
        items: [
          {
            label: "TensorFlow",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/tensorflow/tensorflow-original.svg",
          },
          {
            label: "PyTorch",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/pytorch/pytorch-original.svg",
          },
          {
            label: "Computer Vision",
            icon: "https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/opencv/opencv-original.svg",
          },
        ],
      },
    ],
  },
  projects: {
    title: "Projects",
    subtitle: "Research and Development",
    items: [
      {
        title: "Advanced Billing Management System",
        status: "Website",
        githubUrl: "https://github.com/vignshh7/BillingSystem",
        description: [
          "Developed a comprehensive billing system with dynamic product management and inventory tracking",
          "Implemented real-time stock monitoring, quantity adjustments, and automated sales analytics",
          "Built responsive user interface with intuitive controls for product addition, billing, and report generation",
          "Integrated advanced features for inventory management and business intelligence dashboard",
        ],
        tags: [
          "Full Stack",
          "Web Development",
          "JavaScript",
          "Inventory Management",
        ],
      },
      {
        title: "Diabetes Detection using Iris Images",
        status: "Research",
        githubUrl: "https://github.com/vignshh7/Iris-Diabetes-Detection",
        description: [
          "Conducting novel research to detect diabetic retinopathy through non-invasive iris image analysis.",
          "Developing a deep learning model to identify biomarkers in iris patterns, aiming to provide an early and accessible screening method.",
        ],
        tags: [
          "Computer Vision",
          "Deep Learning",
          "Medical Imaging",
          "Python",
        ],
      },
    ],
  },
  experience: {
    title: "Experience",
    subtitle: "Professional Journey",
    items: [
      {
        role: "Research Intern (Data Science Focus)",
        company: "Dr. Agarwal's Eye Hospital",
        period: "May 2025 - Present",
        bullets: [
          "Developing computer vision models for medical image analysis",
          "Implementing deep learning pipelines for early disease detection",
          "Processing and augmenting medical imaging datasets",
        ],
      },
      {
        role: "Frontend Development Intern",
        company: "Qantler Technologies",
        period: "May 2025 - June 2025",
        bullets: [
          "Designed and developed responsive UI components",
          "Implemented frontend interfaces using modern web technologies",
          "Collaborated on user experience improvements",
        ],
      },
    ],
  },
  achievements: {
    title: "Achievements",
    subtitle: "Competitions and Recognition",
    items: [
      {
        iconClass: "fas fa-trophy",
        title: "National Hackathon Winner",
        company: "Dataset2024 by Nokia",
        description:
          "Led a team to first place in a national-level competition. Developed an innovative data-driven solution for fault detection of devices in network with real time data metrices.",
      },
      {
        iconClass: "fas fa-handshake",
        title: "Project Collaboration",
        company: "Nokia",
        description:
          "Received opportunity to collaborate with Nokia on real-world data solutions following the national hackathon win.",
      },
    ],
  },
  contact: {
    title: "get in touch",
    subtitle: "let's build something extraordinary together",
    items: [
      {
        label: "Email",
        href: "https://mail.google.com/mail/?view=cm&to=vigneshdark07@gmail.com",
        iconClass: "fas fa-envelope",
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/vignshh",
        iconClass: "fab fa-linkedin-in",
      },
      {
        label: "GitHub",
        href: "https://github.com/vignshh7",
        iconClass: "fab fa-github",
      },
      {
        label: "LeetCode",
        href: "https://leetcode.com/u/vignshh",
        iconClass: "fas fa-code",
      },
      {
        label: "Chennai",
        iconClass: "fas fa-map-marker-alt",
        type: "location",
        value: "Chennai, India",
      },
    ],
  },
  footer: {
    text: "© 2025 Vignesh Venkatesan. Crafted with curiosity and code.",
  },
};
