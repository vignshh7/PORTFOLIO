import { useEffect, useMemo, useState } from "react";
import Admin from "./admin/Admin";

const SCROLL_OFFSET = 70;
const MONTHS = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const parseStartDate = (period) => {
  if (!period) return 0;
  const [start] = period.split("-").map((part) => part.trim());
  if (!start) return 0;
  const parts = start.split(" ").filter(Boolean);
  if (parts.length === 1) {
    const yearOnly = Number(parts[0]);
    return Number.isNaN(yearOnly) ? 0 : new Date(yearOnly, 0, 1).getTime();
  }
  const month = MONTHS[parts[0].toLowerCase()];
  const year = Number(parts[1]);
  if (month === undefined || Number.isNaN(year)) return 0;
  return new Date(year, month, 1).getTime();
};

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const apiBase = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE;
    if (base) return base;
    const portfolioUrl =
      import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/portfolio";
    return portfolioUrl.replace(/\/portfolio\/?$/, "");
  }, []);
  const apiOrigin = useMemo(() => apiBase.replace(/\/api\/v1\/?$/, ""), [apiBase]);
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [isSubtitleFading, setIsSubtitleFading] = useState(false);
  const [toast, setToast] = useState(null);

  const sections = useMemo(
    () => ["hero", ...(portfolio?.navLinks || []).map((link) => link.id)],
    [portfolio]
  );

  const sortedExperience = useMemo(() => {
    if (!portfolio?.experience?.items) return [];
    return [...portfolio.experience.items].sort((a, b) =>
      parseStartDate(b.period) - parseStartDate(a.period)
    );
  }, [portfolio]);

  useEffect(() => {
    if (isAdminRoute) {
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/portfolio";
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const payload = await response.json();
        const data = payload?.data || payload;

        if (isMounted) {
          setPortfolio(data);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setLoadError("Failed to load portfolio data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPortfolio();

    return () => {
      isMounted = false;
    };
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) return undefined;
    if (!portfolio?.hero?.rotatingSubtitles?.length) return undefined;
    const interval = setInterval(() => {
      setIsSubtitleFading(true);
      setTimeout(() => {
        setSubtitleIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex % portfolio.hero.rotatingSubtitles.length;
        });
        setIsSubtitleFading(false);
      }, 350);
    }, 3000);

    return () => clearInterval(interval);
  }, [portfolio, isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) return undefined;

    const handleScroll = () => {
      let current = "hero";
      for (let index = sections.length - 1; index >= 0; index -= 1) {
        const sectionId = sections[index];
        const section = document.getElementById(sectionId);
        if (!section) continue;
        const offsetTop = section.offsetTop - SCROLL_OFFSET - 40;
        if (window.scrollY >= offsetTop) {
          current = sectionId;
          break;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, isAdminRoute]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), toast.duration || 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const target = section.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    const start = window.scrollY;
    const distance = target - start;
    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, 400), 900);
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    setIsMenuOpen(false);
  };

  const handleLocationClick = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast({ message: "Location copied to clipboard!", isError: false });
    } catch (error) {
      setToast({ message: "Failed to copy location.", isError: true });
      console.error("Clipboard copy failed:", error);
    }
  };

  if (isAdminRoute) {
    return <Admin />;
  }

  if (isLoading) {
    return (
      <div className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-title">
            <span className="hero-name">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !portfolio) {
    return (
      <div className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-title">
            <span className="hero-name">{loadError || "No data found."}</span>
          </div>
        </div>
      </div>
    );
  }

  const resolveCtaHref = (href, isDownload) => {
    if (!href || href.startsWith("http")) return href;
    if (isDownload && href.startsWith("/api/")) {
      return `${apiOrigin}${href}`;
    }
    return href;
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <a
            href="#hero"
            className="logo"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("hero");
            }}
            onDoubleClick={(event) => {
              event.preventDefault();
              window.location.assign("/admin");
            }}
          >
            {portfolio.site.logoText}
          </a>
          <button
            className={`menu-toggle${isMenuOpen ? " active" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links${isMenuOpen ? " active" : ""}`}>
            {portfolio.navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav-link${activeSection === link.id ? " active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(link.id);
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-title">
            <span className="hero-name">{portfolio.hero.name}</span>
            <span className="hero-subtitle-container">
              <span
                className={`hero-subtitle${isSubtitleFading ? " fade-out" : ""}`}
              >
                {portfolio.hero.rotatingSubtitles[subtitleIndex] ||
                  portfolio.hero.subtitle}
              </span>
            </span>
          </div>
          <p className="hero-description">{portfolio.hero.description}</p>
          <div className="hero-cta">
            {portfolio.hero.ctas.map((cta) => (
              <a
                key={cta.label}
                href={resolveCtaHref(cta.href, cta.download)}
                className={`btn btn-${cta.variant}`}
                download={cta.download}
                onClick={(event) => {
                  if (!cta.href.startsWith("#")) return;
                  event.preventDefault();
                  scrollToSection(cta.href.replace("#", ""));
                }}
              >
                {cta.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="section-header">
          <h2 className="section-title">{portfolio.about.title}</h2>
        </div>
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              {portfolio.about.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="about-columns">
              <div className="education">
              <div className="education-timeline">
                <h3>{portfolio.education.title}</h3>
                <br />
                {portfolio.education.items.map((item) => (
                  <div key={item.institution} className="education-item">
                    <p className="education-period">{item.period}</p>
                    <h4 className="education-institution">{item.institution}</h4>
                    <p className="education-details">{item.details}</p>
                  </div>
                ))}
              </div>

              </div>

              <div className="skills">
                <h3>{portfolio.skills.title}</h3>
                <div className="skills-grid">
                  {portfolio.skills.categories.map((category) => (
                    <div key={category.label} className="skill-category">
                      <h4>{category.label}</h4>
                      <div className="skill-tags">
                        {category.items.map((item) => (
                          <span key={item.label} className="skill-tag-icon">
                            <img src={item.icon} alt={item.label} /> {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects" id="projects">
        <div className="section-header">
          <h2 className="section-title">{portfolio.projects.title}</h2>
          <p className="section-subtitle">{portfolio.projects.subtitle}</p>
        </div>
        <div className="container">
          <div className="projects-grid">
            {portfolio.projects.items.map((project) => (
              <div key={project.title} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <div>
                    <span className="project-status">{project.status}</span>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="github-link"
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="project-description">
                  {Array.isArray(project.description) ? (
                    <ul>
                      {project.description.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{project.description}</p>
                  )}
                </div>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="experience" id="experience">
        <div className="section-header">
          <h2 className="section-title">{portfolio.experience.title}</h2>
          <p className="section-subtitle">{portfolio.experience.subtitle}</p>
        </div>
        <div className="container">
          <div className="timeline">
            {sortedExperience.map((item) => (
              <div key={item.role} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>{item.role}</h3>
                  <p className="timeline-company">{item.company}</p>
                  <p className="timeline-period">{item.period}</p>
                  <ul className="timeline-description">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="achievements" id="achievements">
        <div className="section-header">
          <h2 className="section-title">{portfolio.achievements.title}</h2>
          <p className="section-subtitle">{portfolio.achievements.subtitle}</p>
        </div>
        <div className="container">
          <div className="achievements-grid">
            {portfolio.achievements.items.map((item) => (
              <div key={item.title} className="achievement-card">
                <div className="achievement-header">
                  <i className={`${item.iconClass} achievement-icon`}></i>
                  <h3 className="achievement-title">{item.title}</h3>
                </div>
                <p className="achievement-company">{item.company}</p>
                <p className="achievement-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="section-header">
          <h2 className="section-title">{portfolio.contact.title}</h2>
          <p className="section-subtitle">{portfolio.contact.subtitle}</p>
        </div>
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              {portfolio.contact.items.map((item) => {
                if (item.type === "location") {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="contact-item is-location"
                      onClick={() => handleLocationClick(item.value)}
                    >
                      <i className={`${item.iconClass} contact-icon`}></i>
                      <span className="contact-text">{item.label}</span>
                    </button>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="contact-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className={`${item.iconClass} contact-icon`}></i>
                    <span className="contact-text">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>{portfolio.footer.text}</p>
      </footer>


      {toast ? (
        <div className={`toast${toast.isError ? " is-error" : ""} is-visible`}>
          {toast.message}
        </div>
      ) : null}
    </>
  );
}

export default App;
