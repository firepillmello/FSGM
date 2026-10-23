import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Landmark,
  Files,
  ShieldCheck,
  Sprout,
  HeartHandshake,
  Building2,
  Users,
  Search,
  MoveUpRight,
  ChevronDown,
} from "lucide-react";
import {
  site,
  services,
  industries,
  articles,
  guidanceNotice,
} from "./content";
import "./styles.css";
import "./premium.css";
import "./organization.css";
import { ServicesRail } from "./ServicesRail";
function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`logo ${light ? "light" : ""}`}
      to="/"
      aria-label="FSGM Advisory home"
    >
      <svg
        className="lettermark"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
      >
        <rect
          className="lettermark-frame"
          x="3"
          y="3"
          width="74"
          height="74"
          rx="12"
        />
        <path d="M18 34V17H33M18 25H30" />
        <path d="M61 18H50C44 18 44 26 50 26H56C62 26 62 34 56 34H45" />
        <path d="M33 49C28 44 17 46 17 57C17 68 29 69 34 63V57H26" />
        <path d="M46 66V47L54 58L63 47V66" />
      </svg>
      <span className="logo-wordmark">
        <strong>
          FSGM<span> Advisory</span>
        </strong>
        <small>FEDERAL & STATE GRANT MANAGEMENT</small>
      </span>
    </Link>
  );
}
function Button({
  to = "/#contact",
  children,
  secondary = false,
}: {
  to?: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? "secondary" : ""}`} to={to}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const dropdown = useRef<HTMLDetailsElement>(null);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    if (dropdown.current) dropdown.current.open = false;
  }, [location]);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (dropdown.current && !dropdown.current.contains(event.target as Node))
        dropdown.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (dropdown.current?.open) {
        dropdown.current.open = false;
        dropdown.current.querySelector("summary")?.focus();
      } else if (open) {
        setOpen(false);
        document.querySelector<HTMLButtonElement>(".menu-button")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const current = location.pathname === "/" ? location.hash || "#top" : "";
  return (
    <header>
      <div className="nav-shell">
        <Logo />
        <button
          className="menu-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="navigation"
          className={open ? "open" : ""}
          aria-label="Main navigation"
        >
          {site.navigation.map(([label, path]) =>
            label === "Services" ? (
              <details className="services-dropdown" ref={dropdown} key={label}>
                <summary
                  className={current.startsWith("#service") ? "active" : ""}
                >
                  Services <ChevronDown size={15} />
                </summary>
                <div className="services-menu">
                  <Link className="services-menu-overview" to="/#services">
                    Explore all services <ArrowRight size={16} />
                  </Link>
                  {services.map((service, index) => (
                    <Link key={service.title} to={`/#service-${index}`}>
                      <span>0{index + 1}</span>
                      {service.title}
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={path}
                to={path}
                aria-current={
                  current === path.slice(1) ? "location" : undefined
                }
              >
                {label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
function ArchitecturalVisual() {
  return (
    <div
      className="architecture"
      role="img"
      aria-label="Original architectural illustration of a sunlit colonnade, symbolizing stability and stewardship"
    >
      <div className="sun" />
      <div className="arch arch-back" />
      <div className="arch arch-middle" />
      <div className="arch arch-front" />
      <div className="steps" />
      <div className="visual-caption">
        <span>GROUNDED IN PURPOSE.</span>
        <span>BUILT ON ACCOUNTABILITY.</span>
      </div>
      <div className="visual-seal">
        <Sprout size={23} />
        <span>
          Stewardship
          <br />
          that matters.
        </span>
      </div>
    </div>
  );
}
function IndustryCard({ index }: { index: number }) {
  const Icon = [Sprout, HeartHandshake, Building2, Users][index];
  const industry = industries[index];
  return (
    <article className="industry-card" id={`industry-${index}`}>
      <Icon size={29} strokeWidth={1.2} />
      <h3>{industry.title}</h3>
      <p>{industry.text}</p>
      <details className="inline-disclosure">
        <summary>
          Explore more<span className="sr-only"> about {industry.title}</span>
          <ChevronDown size={16} />
        </summary>
        <div>
          <p>{industry.detail}</p>
          <Link className="text-link" to="/#contact">
            Discuss your needs <ArrowUpRight size={16} />
          </Link>
        </div>
      </details>
    </article>
  );
}
function Home() {
  return (
    <>
      <section className="home-hero container" id="top" tabIndex={-1}>
        <div className="hero-copy">
          <p className="eyebrow">
            FISCAL STEWARDSHIP <i /> COMPLIANCE <i /> COMMUNITY
          </p>
          <h1>
            Every Grant
            <br />
            Has a Purpose.
            <br />
            <em>Every Dollar Deserves Accountability.</em>
          </h1>
          <p>
            FSGM Advisory provides specialized fiscal management and advisory
            services for organizations entrusted with federal and state funding.
            We help you strengthen accountability, navigate financial
            requirements, and protect the mission behind every grant.
          </p>
          <div className="button-row">
            <Button to="/#services">Explore Our Services</Button>
            <Link className="quiet-link" to="/#about">
              About Us <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="hero-note">
            <span className="tiny-line" /> Pennsylvania-based. Community-minded.
          </div>
        </div>
        <ArchitecturalVisual />
      </section>
      <div className="principle-strip">
        <span>EDUCATE FIRST.</span>
        <span className="strip-dot">✧</span>
        <span>BUILD TRUST.</span>
        <span className="strip-dot">✧</span>
        <span>STRENGTHEN COMMUNITIES.</span>
      </div>
      <section
        className="container section split-intro reveal"
        id="about"
        tabIndex={-1}
      >
        <p className="eyebrow">THE PURPOSE BEHIND OUR WORK</p>
        <div>
          <h2>
            You focus on your mission.
            <br />
            <em>We help you protect it.</em>
          </h2>
          <p>
            Public funding creates an opportunity to serve—and a responsibility
            to demonstrate how every dollar supports that service. Clear
            budgets, reliable records, and timely reporting help protect both
            your award and the trust behind it.
          </p>
          <p>
            FSGM Advisory works alongside nonprofits and publicly funded
            organizations to bring structure to post-award financial management.
            From day-to-day reporting to leadership-level oversight, our support
            is designed around your funding requirements, your team’s capacity,
            and your mission.
          </p>
          <details className="inline-disclosure about-disclosure">
            <summary>
              Explore more about us <ChevronDown size={16} />
            </summary>
            <div>
              <h3>Protecting the Purpose Behind Public Funding.</h3>
              <p>
                Our vision is a community sector in which sound financial
                stewardship strengthens, rather than competes with, program
                delivery. We believe clear information, shared understanding,
                and proportionate controls help organizations protect the
                purpose behind public funding.
              </p>
              <p>
                Integrity, accountability, transparency, education, partnership,
                and community impact guide our work. Our focus is post-award
                fiscal advisory support; we do not offer grant-writing, CPA, or
                independent audit services.
              </p>
            </div>
          </details>
        </div>
      </section>
      <ServicesRail />
      <section className="container section" id="who-we-serve" tabIndex={-1}>
        <SectionHeading
          eyebrow="WHO WE SERVE"
          title="Supporting the people who support our communities."
        />
        <div className="industry-grid">
          {industries.map((_, i) => (
            <IndustryCard key={i} index={i} />
          ))}
        </div>
      </section>
      <section className="why section">
        <div className="container why-grid">
          <div>
            <p className="eyebrow">THE FSGM DIFFERENCE</p>
            <h2>
              A thoughtful partner.
              <br />
              <em>A stronger foundation.</em>
            </h2>
            <p>
              Strong fiscal management gives your leadership more than a set of
              numbers. It provides a clearer understanding of commitments,
              emerging risks, and the decisions needed to keep programs moving.
            </p>
            <Button to="/#about" secondary>
              Our philosophy
            </Button>
          </div>
          <div className="advantages">
            {[
              [
                "Focused expertise",
                "A focused approach to the financial responsibilities that follow a federal or state grant award.",
              ],
              [
                "Right-sized support",
                "A defined scope of support that reflects your funding complexity, staffing, and administrative capacity.",
              ],
              [
                "Education at the center",
                "Clear explanations that help your team understand the purpose behind each financial process.",
              ],
              [
                "A collaborative approach",
                "A working relationship that connects leadership, program staff, and financial responsibilities.",
              ],
              [
                "Purpose-led stewardship",
                "Financial oversight grounded in the programs, people, and communities your funding is intended to serve.",
              ],
            ].map(([title, text], i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="OUR APPROACH"
          title="A clear path. A collaborative process."
        />
        <div className="approach">
          {[
            [
              "Understand",
              "We learn how your programs are funded, review your award responsibilities, and identify where your team needs clarity.",
            ],
            [
              "Organize",
              "We help establish a reliable foundation of budgets, supporting records, reporting deadlines, and clear responsibilities.",
            ],
            [
              "Manage",
              "We support a consistent rhythm of expenditure reviews, reconciliations, reimbursement preparation, and reporting.",
            ],
            [
              "Strengthen",
              "We identify practical improvements, explain the reasoning behind them, and help your team sustain stronger routines.",
            ],
          ].map(([title, text], i) => (
            <div key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container education-feature">
        <div className="education-art" aria-hidden="true">
          <Files size={100} strokeWidth={0.65} />
          <span>
            THE AWARD IS JUST
            <br />
            THE BEGINNING.
          </span>
        </div>
        <div>
          <p className="eyebrow">KNOWLEDGE THAT BUILDS CONFIDENCE</p>
          <h2>
            Receiving the grant is a milestone.
            <br />
            <em>Managing it is the ongoing work.</em>
          </h2>
          <p>
            An award letter opens the door. What follows requires consistent
            financial attention: tracking eligible costs, maintaining supporting
            records, monitoring the budget, and meeting reporting deadlines.
            Understanding that responsibility is the first step toward a more
            confident process.
          </p>
          <Link className="text-link" to="/resources/after-the-award">
            Explore the post-award journey <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <ResourcesSection />
      <ContactSection />
    </>
  );
}
function ResourceCard({ article }: { article: (typeof articles)[number] }) {
  return (
    <Link className="resource-card" to={`/resources/${article.slug}`}>
      <div className="resource-art" aria-hidden="true">
        <div className="paper">
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className="resource-symbol">
          <Sprout size={35} strokeWidth={1} />
        </span>
      </div>
      <p className="eyebrow">{article.category}</p>
      <h3>{article.title}</h3>
      <p>{article.intro}</p>
      <span className="text-link">
        Read the article <ArrowUpRight size={16} />
      </span>
    </Link>
  );
}
function ResourcesSection() {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All resources");
  const filtered = articles.filter(
    (article) =>
      (category === "All resources" || article.category === category) &&
      `${article.title} ${article.intro}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const shown = expanded ? filtered : articles.slice(0, 3);
  return (
    <section
      className="container section resource-section"
      id="resources"
      tabIndex={-1}
    >
      <SectionHeading
        eyebrow="THE GRANT RESOURCE CENTER"
        title="Knowledge worth sharing."
        text="Clear, practical guidance to help you navigate the financial responsibilities behind public funding."
      />
      <div id="resource-library">
        {expanded && (
          <>
            <div className="resource-tools">
              <label className="search">
                <Search size={19} />
                <span className="sr-only">Search resources</span>
                <input
                  type="search"
                  placeholder="Search the resource center"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <label className="category-label">
                Browse by topic
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {[
                    "All resources",
                    ...new Set(articles.map((article) => article.category)),
                  ].map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="result-count" aria-live="polite">
              {filtered.length}{" "}
              {filtered.length === 1 ? "resource" : "resources"}
            </p>
          </>
        )}
        <div className="resource-grid">
          {shown.map((article) => (
            <ResourceCard key={article.slug} article={article} />
          ))}
        </div>
        {!shown.length && (
          <div className="empty-state">
            <h3>No resources found.</h3>
            <p>Try a different search or topic.</p>
            <button
              className="button"
              onClick={() => {
                setSearch("");
                setCategory("All resources");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <button
        className="button secondary resource-expand"
        aria-expanded={expanded}
        aria-controls="resource-library"
        onClick={() => {
          setExpanded(!expanded);
          setSearch("");
          setCategory("All resources");
        }}
      >
        {expanded ? "Show fewer resources" : "Explore more resources"}
        <ChevronDown size={17} />
      </button>
      {expanded && <aside className="education-notice">{guidanceNotice}</aside>}
    </section>
  );
}
function Article() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return <NotFound />;
  return (
    <>
      <article className="article-page container">
        <Link className="text-link" to="/#resources">
          ← Back to the resource center
        </Link>
        <p className="eyebrow">{article.category} / FSGM FIELD NOTES</p>
        <h1>{article.title}</h1>
        <p className="article-intro">{article.intro}</p>
        <div className="article-divider" />
        <div className="article-body">
          {article.sections.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
          <aside className="education-notice">{guidanceNotice}</aside>
          <div className="article-end">
            <Sprout />
            <p>
              Have a question about your organization’s financial processes?
            </p>
            <Button>Discuss your needs</Button>
          </div>
        </div>
      </article>
      <section className="container section">
        <SectionHeading
          eyebrow="KEEP LEARNING"
          title="More from the resource center."
        />
        <div className="resource-grid">
          {articles
            .filter((a) => a.slug !== slug)
            .slice(0, 3)
            .map((a) => (
              <ResourceCard key={a.slug} article={a} />
            ))}
        </div>
      </section>
    </>
  );
}
function ContactForm() {
  const { state } = useLocation();
  const [assistance, setAssistance] = useState("");
  useEffect(() => {
    if (
      typeof state?.service === "string" &&
      services.some((service) => service.title === state.service)
    )
      setAssistance(state.service);
  }, [state]);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    if (!site.formEndpoint) {
      setStatus(
        "Demo complete. Your entries were validated in this browser only. Nothing was sent or saved. This preview does not request a consultation.",
      );
      return;
    }
    setSending(true);
    try {
      const response = await fetch(site.formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error();
      setStatus("Your inquiry was submitted. Thank you for reaching out.");
      form.reset();
    } catch {
      setStatus("Your inquiry could not be sent. Please try again later.");
    } finally {
      setSending(false);
    }
  }
  return (
    <form onSubmit={submit} className="contact-form">
      <div className="preview-notice">
        <ShieldCheck size={22} />
        <div>
          <strong>
            {site.formEndpoint
              ? "General inquiries only"
              : "Preview mode — no information is sent"}
          </strong>
          <p>
            {site.formEndpoint
              ? "Please share only general business contact information."
              : "This demo validates your entries locally. A production contact service has not been connected."}
          </p>
        </div>
      </div>
      <div className="form-grid">
        <label>
          Organization name
          <input
            name="organization"
            autoComplete="organization"
            required
            maxLength={160}
          />
        </label>
        <label>
          Contact person’s name
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Phone <span>(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        <label>
          Organization type
          <select name="type" required defaultValue="">
            <option value="" disabled>
              Select an organization type
            </option>
            {industries.map((i) => (
              <option key={i.title}>{i.title}</option>
            ))}
            <option>Other</option>
          </select>
        </label>
        <label>
          General assistance needed
          <select
            name="assistance"
            required
            value={assistance}
            onChange={(event) => setAssistance(event.target.value)}
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.title}>{s.title}</option>
            ))}
            <option>Not sure yet</option>
          </select>
        </label>
        <label className="full">
          How can we help?
          <textarea
            name="message"
            required
            rows={5}
            maxLength={3000}
            placeholder="Tell us a little about your organization and the support you are looking for."
          />
        </label>
      </div>
      <p className="small-note">
        Please do not include grant documents, financial account details,
        personal client information, or other sensitive records.
      </p>
      <button className="button" disabled={sending} type="submit">
        {sending
          ? "Sending…"
          : site.formEndpoint
            ? "Send inquiry"
            : "Preview inquiry"}
        <ArrowUpRight size={17} />
      </button>
      <p role="status" className={status ? "form-status" : ""}>
        {status}
      </p>
      <p className="privacy-note">
        Privacy: In preview mode, form entries stay in this page’s memory and
        are not transmitted or stored. If a production form provider is
        configured, review its privacy terms before submitting. No analytics or
        marketing trackers are installed.
      </p>
    </form>
  );
}
function ContactSection() {
  return (
    <section className="contact-section" id="contact" tabIndex={-1}>
      <div className="container contact-section-heading">
        <SectionHeading
          eyebrow="LET’S START A CONVERSATION"
          title="Discuss your needs."
          text="Tell us about your organization, the funding you manage, and the financial responsibilities you would like to strengthen. We can begin by understanding your priorities and discussing an appropriate next step."
        />
      </div>
      <div className="container contact-layout">
        <aside>
          <h3>
            Practical guidance.
            <br />
            Support at your scale.
          </h3>
          <p>
            Whether you are navigating a reporting deadline, reviewing your
            financial processes, or considering ongoing fiscal oversight, the
            first step is to define the challenge together.
          </p>
          <div className="location">
            <Landmark size={22} />
            <span>{site.location}</span>
          </div>
          {site.email && (
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}
          {site.phone && (
            <p>
              <a href={`tel:${site.phone}`}>{site.phone}</a>
            </p>
          )}
          {site.schedulingUrl && (
            <a className="text-link" href={site.schedulingUrl}>
              Discuss your needs <ArrowUpRight size={16} />
            </a>
          )}
        </aside>
        <ContactForm />
      </div>
    </section>
  );
}
function NotFound() {
  return (
    <section className="container not-found">
      <p className="eyebrow">404 / A DIFFERENT PATH</p>
      <h1>
        Let’s get you
        <br />
        <em>back on course.</em>
      </h1>
      <p>
        The page you’re looking for isn’t here. Our resources and services are a
        good place to begin.
      </p>
      <Button to="/">Return home</Button>
    </section>
  );
}
function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <div>
          <Logo light />
          <p>
            Protecting the Purpose
            <br />
            Behind Public Funding.
          </p>
          <span className="footer-location">Pennsylvania, United States</span>
        </div>
        <div>
          <p className="eyebrow">EXPLORE</p>
          {site.navigation.slice(1).map(([title, path]) => (
            <Link to={path} key={path}>
              {title}
            </Link>
          ))}
        </div>
        <div className="footer-note">
          <p className="eyebrow">OUR PHILOSOPHY</p>
          <h3>
            Educate First.
            <br />
            Build Trust.
            <br />
            Strengthen Communities.
          </h3>
          <Link className="text-link" to="/#contact">
            Discuss your needs <MoveUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} FSGM Advisory. All rights reserved.
        </span>
        <span>Independent advisory services. No government affiliation.</span>
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            })
          }
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    const fragment = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      if (fragment) {
        const target = document.getElementById(fragment);
        target?.scrollIntoView({
          block: "start",
          behavior:
            location.key === "default" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
        });
        target?.focus({ preventScroll: true });
      } else window.scrollTo(0, 0);
    }, 30);
    const article = articles.find(
      (a) => location.pathname === `/resources/${a.slug}`,
    );
    const [title, description] = article
      ? [article.title, article.intro]
      : location.pathname === "/"
        ? [
            "Government Grant Fiscal Management",
            "Pennsylvania-based post-award grant fiscal management for nonprofits and community organizations.",
          ]
        : ["Page Not Found", "Find your way back to FSGM Advisory."];
    document.title = `${title} | FSGM Advisory`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    return () => clearTimeout(timer);
  }, [location]);
  return null;
}
function LegacySection({ section }: { section: string }) {
  const { hash } = useLocation();
  const index = /^#([0-6])$/.exec(hash)?.[1];
  const target =
    section === "services" && index
      ? `service-${index}`
      : section === "who-we-serve" && index && Number(index) < industries.length
        ? `industry-${index}`
        : section;
  return <Navigate replace to={`/#${target}`} />;
}
function App() {
  return (
    <>
      <ScrollToTop />
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<LegacySection section="about" />} />
          <Route
            path="/services"
            element={<LegacySection section="services" />}
          />
          <Route
            path="/who-we-serve"
            element={<LegacySection section="who-we-serve" />}
          />
          <Route
            path="/resources"
            element={<LegacySection section="resources" />}
          />
          <Route path="/resources/:slug" element={<Article />} />
          <Route
            path="/contact"
            element={<LegacySection section="contact" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
