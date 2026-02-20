import { useEffect, useMemo, useState } from "react";

const emptyPortfolio = () => ({
  site: { logoText: "", title: "" },
  navLinks: [],
  hero: {
    name: "",
    subtitle: "",
    rotatingSubtitles: [],
    description: "",
    ctas: [],
  },
  about: { title: "", text: [] },
  education: { title: "", items: [] },
  skills: { title: "", categories: [] },
  projects: { title: "", subtitle: "", items: [] },
  experience: { title: "", subtitle: "", items: [] },
  achievements: { title: "", subtitle: "", items: [] },
  contact: { title: "", subtitle: "", items: [] },
  footer: { text: "" },
});

const toLines = (value) => (value || []).join("\n");
const fromLines = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const updateListItem = (list, index, changes) =>
  list.map((item, idx) => (idx === index ? { ...item, ...changes } : item));

const getApiBase = () => {
  const base = import.meta.env.VITE_API_BASE;
  if (base) return base;
  const portfolioUrl =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/portfolio";
  return portfolioUrl.replace(/\/portfolio\/?$/, "");
};

function Admin() {
  const apiBase = useMemo(() => getApiBase(), []);
  const [portfolioId, setPortfolioId] = useState(null);
  const [draft, setDraft] = useState(emptyPortfolio);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("portfolioAdminUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const loadPortfolio = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${apiBase}/portfolio`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const payload = await response.json();
      const data = payload?.data || payload;
      setPortfolioId(payload?._id || payload?.id || data?._id || data?.id || null);
      setDraft(data);
    } catch (loadError) {
      console.error(loadError);
      setError("Failed to load portfolio data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadPortfolio();
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${apiBase}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Login failed.");
      }

      const payload = await response.json();
      localStorage.setItem("portfolioAdminUser", JSON.stringify(payload.user));
      setUser(payload.user);
      setCredentials({ username: "", password: "" });
    } catch (loginError) {
      console.error(loginError);
      setError(loginError.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolioAdminUser");
    setUser(null);
    setDraft(emptyPortfolio());
    setPortfolioId(null);
  };

  const handleSave = async () => {
    setError(null);
    setMessage(null);

    try {
      const endpoint = portfolioId
        ? `${apiBase}/portfolio/${portfolioId}`
        : `${apiBase}/portfolio`;

      const response = await fetch(endpoint, {
        method: portfolioId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: draft }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Save failed.");
      }

      const payload = await response.json();
      setPortfolioId(payload?._id || payload?.id || portfolioId);
      setMessage("Saved successfully.");
    } catch (saveError) {
      console.error(saveError);
      setError(saveError.message);
    }
  };

  if (!user) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h1>Admin Login</h1>
          <p>Sign in to edit portfolio content.</p>
          {error ? <div className="admin-alert error">{error}</div> : null}
          <form className="admin-form" onSubmit={handleLogin}>
            <label>
              Username
              <input
                type="text"
                value={credentials.username}
                onChange={(event) =>
                  setCredentials((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                required
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Portfolio Admin</h1>
          <p>Edit and publish your portfolio content.</p>
        </div>
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary" onClick={loadPortfolio}>
            Refresh
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </header>

      {isLoading ? <div className="admin-alert">Loading...</div> : null}
      {message ? <div className="admin-alert success">{message}</div> : null}
      {error ? <div className="admin-alert error">{error}</div> : null}

      <section className="admin-section">
        <h2>Site</h2>
        <div className="admin-grid">
          <label>
            Logo Text
            <input
              type="text"
              value={draft.site.logoText}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  site: { ...prev.site, logoText: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Title
            <input
              type="text"
              value={draft.site.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  site: { ...prev.site, title: event.target.value },
                }))
              }
            />
          </label>
        </div>
      </section>

      <section className="admin-section">
        <h2>Navigation Links</h2>
        {draft.navLinks.map((link, index) => (
          <div key={`${link.id}-${index}`} className="admin-row">
            <input
              type="text"
              placeholder="id"
              value={link.id}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  navLinks: updateListItem(prev.navLinks, index, {
                    id: event.target.value,
                  }),
                }))
              }
            />
            <input
              type="text"
              placeholder="label"
              value={link.label}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  navLinks: updateListItem(prev.navLinks, index, {
                    label: event.target.value,
                  }),
                }))
              }
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  navLinks: prev.navLinks.filter((_, idx) => idx !== index),
                }))
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              navLinks: [...prev.navLinks, { id: "", label: "" }],
            }))
          }
        >
          Add Link
        </button>
      </section>

      <section className="admin-section">
        <h2>Hero</h2>
        <div className="admin-grid">
          <label>
            Name
            <input
              type="text"
              value={draft.hero.name}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, name: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Subtitle
            <input
              type="text"
              value={draft.hero.subtitle}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: event.target.value },
                }))
              }
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            rows={3}
            value={draft.hero.description}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                hero: { ...prev.hero, description: event.target.value },
              }))
            }
          />
        </label>
        <label>
          Rotating Subtitles (one per line)
          <textarea
            rows={4}
            value={toLines(draft.hero.rotatingSubtitles)}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  rotatingSubtitles: fromLines(event.target.value),
                },
              }))
            }
          />
        </label>

        <div className="admin-subsection">
          <h3>CTA Buttons</h3>
          {draft.hero.ctas.map((cta, index) => (
            <div key={`${cta.label}-${index}`} className="admin-row">
              <input
                type="text"
                placeholder="label"
                value={cta.label}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      ctas: updateListItem(prev.hero.ctas, index, {
                        label: event.target.value,
                      }),
                    },
                  }))
                }
              />
              <input
                type="text"
                placeholder="href"
                value={cta.href}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      ctas: updateListItem(prev.hero.ctas, index, {
                        href: event.target.value,
                      }),
                    },
                  }))
                }
              />
              <input
                type="text"
                placeholder="variant"
                value={cta.variant}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      ctas: updateListItem(prev.hero.ctas, index, {
                        variant: event.target.value,
                      }),
                    },
                  }))
                }
              />
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(cta.download)}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        ctas: updateListItem(prev.hero.ctas, index, {
                          download: event.target.checked,
                        }),
                      },
                    }))
                  }
                />
                Download
              </label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      ctas: prev.hero.ctas.filter((_, idx) => idx !== index),
                    },
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  ctas: [
                    ...prev.hero.ctas,
                    { label: "", href: "", variant: "secondary", download: false },
                  ],
                },
              }))
            }
          >
            Add CTA
          </button>
        </div>
      </section>

      <section className="admin-section">
        <h2>About</h2>
        <div className="admin-grid">
          <label>
            Title
            <input
              type="text"
              value={draft.about.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  about: { ...prev.about, title: event.target.value },
                }))
              }
            />
          </label>
        </div>
        <label>
          Paragraphs (one per line)
          <textarea
            rows={4}
            value={toLines(draft.about.text)}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                about: { ...prev.about, text: fromLines(event.target.value) },
              }))
            }
          />
        </label>
      </section>

      <section className="admin-section">
        <h2>Education</h2>
        <div className="admin-grid">
          <label>
            Title
            <input
              type="text"
              value={draft.education.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  education: { ...prev.education, title: event.target.value },
                }))
              }
            />
          </label>
        </div>
        {draft.education.items.map((item, index) => (
          <div key={`${item.institution}-${index}`} className="admin-card-block">
            <div className="admin-grid">
              <label>
                Period
                <input
                  type="text"
                  value={item.period}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      education: {
                        ...prev.education,
                        items: updateListItem(prev.education.items, index, {
                          period: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Institution
                <input
                  type="text"
                  value={item.institution}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      education: {
                        ...prev.education,
                        items: updateListItem(prev.education.items, index, {
                          institution: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Details
              <input
                type="text"
                value={item.details}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    education: {
                      ...prev.education,
                      items: updateListItem(prev.education.items, index, {
                        details: event.target.value,
                      }),
                    },
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  education: {
                    ...prev.education,
                    items: prev.education.items.filter((_, idx) => idx !== index),
                  },
                }))
              }
            >
              Remove Item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              education: {
                ...prev.education,
                items: [
                  ...prev.education.items,
                  { period: "", institution: "", details: "" },
                ],
              },
            }))
          }
        >
          Add Education
        </button>
      </section>

      <section className="admin-section">
        <h2>Skills</h2>
        <div className="admin-grid">
          <label>
            Title
            <input
              type="text"
              value={draft.skills.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  skills: { ...prev.skills, title: event.target.value },
                }))
              }
            />
          </label>
        </div>
        {draft.skills.categories.map((category, index) => (
          <div key={`${category.label}-${index}`} className="admin-card-block">
            <div className="admin-grid">
              <label>
                Category Label
                <input
                  type="text"
                  value={category.label}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      skills: {
                        ...prev.skills,
                        categories: updateListItem(prev.skills.categories, index, {
                          label: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Items (format: Label | Icon URL, one per line)
              <textarea
                rows={4}
                value={(category.items || [])
                  .map((item) => `${item.label} | ${item.icon}`)
                  .join("\n")}
                onChange={(event) => {
                  const items = event.target.value
                    .split("\n")
                    .map((line) => line.split("|").map((part) => part.trim()))
                    .filter((parts) => parts[0])
                    .map(([label, icon]) => ({ label, icon: icon || "" }));

                  setDraft((prev) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      categories: updateListItem(prev.skills.categories, index, {
                        items,
                      }),
                    },
                  }));
                }}
              />
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  skills: {
                    ...prev.skills,
                    categories: prev.skills.categories.filter((_, idx) => idx !== index),
                  },
                }))
              }
            >
              Remove Category
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              skills: {
                ...prev.skills,
                categories: [...prev.skills.categories, { label: "", items: [] }],
              },
            }))
          }
        >
          Add Category
        </button>
      </section>

      <section className="admin-section">
        <h2>Projects</h2>
        <div className="admin-grid">
          <label>
            Title
            <input
              type="text"
              value={draft.projects.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  projects: { ...prev.projects, title: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Subtitle
            <input
              type="text"
              value={draft.projects.subtitle}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  projects: { ...prev.projects, subtitle: event.target.value },
                }))
              }
            />
          </label>
        </div>
        {draft.projects.items.map((project, index) => (
          <div key={`${project.title}-${index}`} className="admin-card-block">
            <div className="admin-grid">
              <label>
                Title
                <input
                  type="text"
                  value={project.title}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      projects: {
                        ...prev.projects,
                        items: updateListItem(prev.projects.items, index, {
                          title: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Status
                <input
                  type="text"
                  value={project.status}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      projects: {
                        ...prev.projects,
                        items: updateListItem(prev.projects.items, index, {
                          status: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                GitHub URL
                <input
                  type="text"
                  value={project.githubUrl || ""}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      projects: {
                        ...prev.projects,
                        items: updateListItem(prev.projects.items, index, {
                          githubUrl: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Description (one per line)
              <textarea
                rows={4}
                value={toLines(project.description || [])}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    projects: {
                      ...prev.projects,
                      items: updateListItem(prev.projects.items, index, {
                        description: fromLines(event.target.value),
                      }),
                    },
                  }))
                }
              />
            </label>
            <label>
              Tags (one per line)
              <textarea
                rows={3}
                value={toLines(project.tags || [])}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    projects: {
                      ...prev.projects,
                      items: updateListItem(prev.projects.items, index, {
                        tags: fromLines(event.target.value),
                      }),
                    },
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  projects: {
                    ...prev.projects,
                    items: prev.projects.items.filter((_, idx) => idx !== index),
                  },
                }))
              }
            >
              Remove Project
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              projects: {
                ...prev.projects,
                items: [
                  ...prev.projects.items,
                  {
                    title: "",
                    status: "",
                    githubUrl: "",
                    description: [],
                    tags: [],
                  },
                ],
              },
            }))
          }
        >
          Add Project
        </button>
      </section>

      <section className="admin-section">
        <h2>Experience</h2>
        <div className="admin-grid">
          <label>
            Title
            <input
              type="text"
              value={draft.experience.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  experience: { ...prev.experience, title: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Subtitle
            <input
              type="text"
              value={draft.experience.subtitle}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  experience: { ...prev.experience, subtitle: event.target.value },
                }))
              }
            />
          </label>
        </div>
        {draft.experience.items.map((item, index) => (
          <div key={`${item.role}-${index}`} className="admin-card-block">
            <div className="admin-grid">
              <label>
                Role
                <input
                  type="text"
                  value={item.role}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      experience: {
                        ...prev.experience,
                        items: updateListItem(prev.experience.items, index, {
                          role: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Company
                <input
                  type="text"
                  value={item.company}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      experience: {
                        ...prev.experience,
                        items: updateListItem(prev.experience.items, index, {
                          company: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Period
                <input
                  type="text"
                  value={item.period}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      experience: {
                        ...prev.experience,
                        items: updateListItem(prev.experience.items, index, {
                          period: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Bullets (one per line)
              <textarea
                rows={4}
                value={toLines(item.bullets || [])}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    experience: {
                      ...prev.experience,
                      items: updateListItem(prev.experience.items, index, {
                        bullets: fromLines(event.target.value),
                      }),
                    },
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  experience: {
                    ...prev.experience,
                    items: prev.experience.items.filter((_, idx) => idx !== index),
                  },
                }))
              }
            >
              Remove Experience
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              experience: {
                ...prev.experience,
                items: [
                  ...prev.experience.items,
                  { role: "", company: "", period: "", bullets: [] },
                ],
              },
            }))
          }
        >
          Add Experience
        </button>
      </section>

      <section className="admin-section">
        <h2>Achievements</h2>
        <div className="admin-grid">
          <label>
            Title
            <input
              type="text"
              value={draft.achievements.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  achievements: {
                    ...prev.achievements,
                    title: event.target.value,
                  },
                }))
              }
            />
          </label>
          <label>
            Subtitle
            <input
              type="text"
              value={draft.achievements.subtitle}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  achievements: {
                    ...prev.achievements,
                    subtitle: event.target.value,
                  },
                }))
              }
            />
          </label>
        </div>
        {draft.achievements.items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="admin-card-block">
            <div className="admin-grid">
              <label>
                Icon Class
                <input
                  type="text"
                  value={item.iconClass}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      achievements: {
                        ...prev.achievements,
                        items: updateListItem(prev.achievements.items, index, {
                          iconClass: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Title
                <input
                  type="text"
                  value={item.title}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      achievements: {
                        ...prev.achievements,
                        items: updateListItem(prev.achievements.items, index, {
                          title: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Company
                <input
                  type="text"
                  value={item.company}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      achievements: {
                        ...prev.achievements,
                        items: updateListItem(prev.achievements.items, index, {
                          company: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Description
              <textarea
                rows={3}
                value={item.description}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    achievements: {
                      ...prev.achievements,
                      items: updateListItem(prev.achievements.items, index, {
                        description: event.target.value,
                      }),
                    },
                  }))
                }
              />
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  achievements: {
                    ...prev.achievements,
                    items: prev.achievements.items.filter((_, idx) => idx !== index),
                  },
                }))
              }
            >
              Remove Achievement
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              achievements: {
                ...prev.achievements,
                items: [
                  ...prev.achievements.items,
                  { iconClass: "", title: "", company: "", description: "" },
                ],
              },
            }))
          }
        >
          Add Achievement
        </button>
      </section>

      <section className="admin-section">
        <h2>Contact</h2>
        <div className="admin-grid">
          <label>
            Title
            <input
              type="text"
              value={draft.contact.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, title: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Subtitle
            <input
              type="text"
              value={draft.contact.subtitle}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, subtitle: event.target.value },
                }))
              }
            />
          </label>
        </div>
        {draft.contact.items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="admin-card-block">
            <div className="admin-grid">
              <label>
                Label
                <input
                  type="text"
                  value={item.label}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        items: updateListItem(prev.contact.items, index, {
                          label: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Icon Class
                <input
                  type="text"
                  value={item.iconClass}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        items: updateListItem(prev.contact.items, index, {
                          iconClass: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Type
                <input
                  type="text"
                  value={item.type || ""}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        items: updateListItem(prev.contact.items, index, {
                          type: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
            </div>
            <div className="admin-grid">
              <label>
                Link
                <input
                  type="text"
                  value={item.href || ""}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        items: updateListItem(prev.contact.items, index, {
                          href: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
              <label>
                Value (for location)
                <input
                  type="text"
                  value={item.value || ""}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        items: updateListItem(prev.contact.items, index, {
                          value: event.target.value,
                        }),
                      },
                    }))
                  }
                />
              </label>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    items: prev.contact.items.filter((_, idx) => idx !== index),
                  },
                }))
              }
            >
              Remove Contact
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              contact: {
                ...prev.contact,
                items: [
                  ...prev.contact.items,
                  { label: "", href: "", iconClass: "", type: "", value: "" },
                ],
              },
            }))
          }
        >
          Add Contact
        </button>
      </section>

      <section className="admin-section">
        <h2>Footer</h2>
        <label>
          Text
          <input
            type="text"
            value={draft.footer.text}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                footer: { ...prev.footer, text: event.target.value },
              }))
            }
          />
        </label>
      </section>
    </div>
  );
}

export default Admin;
