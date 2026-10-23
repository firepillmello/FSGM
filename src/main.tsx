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
  resourceTopics,
} from "./content";
import "./site.css";
import { ServicesRail } from "./ServicesRail";
import { PageFlow } from "./PageFlow";
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
  const servicesDropdown = useRef<HTMLDetailsElement>(null);
  const audiencesDropdown = useRef<HTMLDetailsElement>(null);
  const resourcesDropdown = useRef<HTMLDetailsElement>(null);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    if (servicesDropdown.current) servicesDropdown.current.open = false;
    if (audiencesDropdown.current) audiencesDropdown.current.open = false;
    if (resourcesDropdown.current) resourcesDropdown.current.open = false;
  }, [location]);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      for (const ref of [
        servicesDropdown,
        audiencesDropdown,
        resourcesDropdown,
      ])
        if (ref.current && !ref.current.contains(event.target as Node))
          ref.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const expanded = [
        servicesDropdown,
        audiencesDropdown,
        resourcesDropdown,
      ].find((ref) => ref.current?.open)?.current;
      if (expanded) {
        expanded.open = false;
        expanded.querySelector("summary")?.focus();
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
          {site.navigation.map(([label, path]) => {
            if (
              label !== "Services" &&
              label !== "Who We Serve" &&
              label !== "Resources"
            )
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={
                    current === path.slice(1) ? "location" : undefined
                  }
                >
                  {label}
                </Link>
              );
            const isServices = label === "Services";
            const isResources = label === "Resources";
            const ref = isResources
              ? resourcesDropdown
              : isServices
                ? servicesDropdown
                : audiencesDropdown;
            const items = isResources
              ? resourceTopics.map((topic) => ({
                  title: topic.label,
                  target: `resources-${topic.slug}`,
                }))
              : (isServices ? services : industries).map((item, index) => ({
                  title: item.title,
                  target: `${isServices ? "service" : "industry"}-${index}`,
                }));
            const prefix = isResources
              ? "resources"
              : isServices
                ? "service"
                : "industry";
            return (
              <details
                key={label}
                ref={ref}
                className={`nav-dropdown ${isResources ? "resources-dropdown" : isServices ? "services-dropdown" : "audiences-dropdown"}`}
                onToggle={(event) => {
                  if (event.currentTarget.open)
                    for (const candidate of [
                      servicesDropdown,
                      audiencesDropdown,
                      resourcesDropdown,
                    ]) {
                      if (
                        candidate.current &&
                        candidate.current !== event.currentTarget
                      )
                        candidate.current.open = false;
                    }
                }}
              >
                <summary
                  className={
                    current.startsWith(`#${prefix}`) ||
                    current === path.slice(1) ||
                    (isResources && location.pathname.startsWith("/resources/"))
                      ? "active"
                      : ""
                  }
                >
                  {label}
                  <ChevronDown size={15} />
                </summary>
                <div className="dropdown-menu services-menu">
                  <Link
                    className="dropdown-overview"
                    to={isResources ? "/#resources-all" : path}
                  >
                    {isResources
                      ? "Explore all resources"
                      : isServices
                        ? "Explore all services"
                        : "Explore who we serve"}
                    <ArrowRight size={16} />
                  </Link>
                  {items.map((item, index) => (
                    <Link
                      key={item.title}
                      to={`/#${item.target}`}
                      aria-current={
                        current === `#${item.target}` ? "location" : undefined
                      }
                    >
                      <span>0{index + 1}</span>
                      {item.title}
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
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
function CommunityVisual() {
  return (
    <figure className="community-visual">
      <img
        src={`${import.meta.env.BASE_URL}images/community-river.webp`}
        width="1536"
        height="1024"
        alt="Illustrative riverside community framed by wooded hills in warm morning light"
        fetchPriority="high"
      />
      <div className="image-kicker">
        <span />
        ROOTED IN COMMUNITY
      </div>
      <figcaption>
        <span className="eyebrow">THE PURPOSE BEHIND EVERY DOLLAR</span>
        <strong>
          Clear finances.
          <br />
          <em>Lasting purpose.</em>
        </strong>
        <span className="image-caption">
          Pennsylvania-based. Community-minded.
        </span>
      </figcaption>
    </figure>
  );
}
function IndustryCard({ index }: { index: number }) {
  const Icon = [Sprout, HeartHandshake, Building2, Users][index];
  const industry = industries[index];
  const { hash } = useLocation();
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (hash.startsWith("#industry-") && disclosure.current)
      disclosure.current.open = hash === `#industry-${index}`;
  }, [hash, index]);
  return (
    <article className="industry-card" id={`industry-${index}`} tabIndex={-1}>
      <Icon size={29} strokeWidth={1.2} />
      <h3>{industry.title}</h3>
      <p>{industry.text}</p>
      <details className="inline-disclosure" ref={disclosure}>
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
            GRANT FINANCES <i /> CONFIDENCE <i /> COMMUNITY
          </p>
          <h1>
            Every Grant
            <br />
            Has a Purpose.
            <br />
            <em>Every Dollar Deserves Accountability.</em>
          </h1>
          <p>
            FSGM Advisory helps organizations manage federal and state grant
            funding with clear budgets, reliable reports, and practical
            financial guidance. We help you understand the requirements, keep
            spending on track, and protect the purpose behind every grant.
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
        <CommunityVisual />
      </section>
      <div className="principle-strip">
        <span>EDUCATE FIRST.</span>
        <span className="strip-dot">✧</span>
        <span>BUILD TRUST.</span>
        <span className="strip-dot">✧</span>
        <span>STRENGTHEN COMMUNITIES.</span>
      </div>
      <section
        className="container section story-section"
        id="about"
        tabIndex={-1}
      >
        <div className="story-copy">
          <p className="eyebrow">OUR STORY</p>
          <h2>
            Community purpose.
            <br />
            <em>Fiscal leadership.</em>
          </h2>
          <p className="story-lead">
            Public funding begins with a promise: services people can rely on,
            programs that endure, and communities with a stronger future.
          </p>
          <p>
            FSGM Advisory exists because the work behind that promise deserves
            thoughtful financial leadership. When grant budgets, documentation,
            reimbursements, and reporting compete for attention, the purpose of
            the funding should remain at the center of every decision.
          </p>
          <p>
            Our approach brings the expertise and perspective of a Fiscal
            Director into the everyday management of public funds—connecting
            financial oversight with the mission it is meant to support. We want
            that level of guidance to be accessible without requiring a
            full-time fiscal executive.
          </p>
          <details className="inline-disclosure about-disclosure">
            <summary>
              Explore more about us
              <ChevronDown size={16} />
            </summary>
            <div>
              <h3>Protecting the Purpose Behind Public Funding.</h3>
              <p>
                A Fiscal Director looks beyond a single report to understand the
                whole financial picture: how a budget supports a program, how
                costs are documented, how reimbursement affects cash flow, and
                what leadership needs to know before the next decision.
              </p>
              <p>
                That perspective shapes our work. We help build clear
                responsibilities, practical controls, and financial routines
                that strengthen accountability while allowing community work to
                move forward.
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
        <aside className="story-aside">
          <figure className="story-image">
            <img
              src={`${import.meta.env.BASE_URL}images/community-town.png`}
              width="310"
              height="149"
              loading="lazy"
              alt="Historic riverside community and a bridge surrounded by autumn trees"
            />
            <figcaption>
              Community is the reason. Responsible funding is the promise.
            </figcaption>
          </figure>
          <div className="director-note">
            <p className="eyebrow">THE FISCAL DIRECTOR PERSPECTIVE</p>
            <h3>
              The whole picture.
              <br />A clearer direction.
            </h3>
            <p>
              Budget oversight. Sound financial processes. Informed leadership
              decisions. Each should serve the purpose behind the funding.
            </p>
            <Link className="text-link" to="/#services">
              Explore our approach to support
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </aside>
      </section>
      <ServicesRail />
      <section
        className="audience-section section"
        id="who-we-serve"
        tabIndex={-1}
      >
        <div className="container">
          <SectionHeading
            eyebrow="WHO WE SERVE"
            title="Supporting the people who support our communities."
          />
          <div className="industry-grid">
            {industries.map((_, i) => (
              <IndustryCard key={i} index={i} />
            ))}
          </div>
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
                "Support shaped around the grants you manage, the people on your team, and the time you have available.",
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
                "Responsible funding",
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
              "We regularly review spending, check that records match, prepare payment requests, and keep reports on track.",
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
        <figure className="education-art">
          <img
            src={`${import.meta.env.BASE_URL}images/financial-planning.png`}
            width="306"
            height="158"
            loading="lazy"
            alt="Financial charts, a notebook, and a pen arranged for a budget review"
          />
          <figcaption>The award is just the beginning.</figcaption>
        </figure>
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
            Learn what happens after the award <ArrowUpRight size={17} />
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
      <div className="resource-art">
        <img
          src={`${import.meta.env.BASE_URL}images/${article.category === "Getting started" ? "pennsylvania-capitol" : article.category === "Leadership" || article.category === "Financial controls" ? "collaboration" : "financial-planning"}.png`}
          loading="lazy"
          alt={
            article.category === "Getting started"
              ? "Pennsylvania State Capitol exterior"
              : article.category === "Leadership" ||
                  article.category === "Financial controls"
                ? "Illustrative professionals discussing financial documents"
                : "Charts and supporting records prepared for financial planning"
          }
        />
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
  const { hash } = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All resources");
  useEffect(() => {
    const slug = /^#resources-(.+)$/.exec(hash)?.[1];
    const topic = resourceTopics.find((item) => item.slug === slug);
    if (slug === "all" || topic) {
      setExpanded(true);
      setCategory(topic?.label || "All resources");
      setSearch("");
    }
  }, [hash]);
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
        const target = document.getElementById(
          fragment.startsWith("resources-") ? "resources" : fragment,
        );
        target?.scrollIntoView({
          block: "start",
          behavior:
            location.key === "default" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
        });
        target?.focus({ preventScroll: true });
      } else window.scrollTo({ top: 0, behavior: "instant" });
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
      <PageFlow />
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
