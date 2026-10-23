import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Files,
  ShieldCheck,
  Landmark,
  Sprout,
  X,
} from "lucide-react";
import { services } from "./content";

const icons = [
  ChartNoAxesCombined,
  Files,
  ChartNoAxesCombined,
  ShieldCheck,
  Files,
  Landmark,
  Sprout,
];

export function ServicesRail() {
  const { hash } = useLocation();
  const match = /^#service-(\d+)$/.exec(hash);
  const selected =
    match && Number(match[1]) < services.length ? Number(match[1]) : null;
  const rail = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [bounds, setBounds] = useState({ start: true, end: false });
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => setReduced(media.matches);
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const measure = () =>
      setBounds({
        start: element.scrollLeft < 8,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 8,
      });
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    element.addEventListener("scroll", measure, { passive: true });
    measure();
    return () => {
      resize.disconnect();
      element.removeEventListener("scroll", measure);
    };
  }, []);

  useEffect(() => {
    if (selected === null || !rail.current) return;
    const element = rail.current;
    const card = element.children[selected] as HTMLElement;
    element.scrollTo({
      left:
        card.getBoundingClientRect().left -
        element.getBoundingClientRect().left +
        element.scrollLeft,
      behavior: "instant",
    });
  }, [selected]);

  function move(direction: number) {
    const element = rail.current;
    if (element)
      element.scrollBy({
        left:
          direction *
          ((element.firstElementChild?.getBoundingClientRect().width || 350) +
            24),
        behavior: reduced ? "instant" : "smooth",
      });
  }
  const service = selected === null ? null : services[selected];
  const Icon = selected === null ? null : icons[selected];

  return (
    <section className="services-section section" id="services" tabIndex={-1}>
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">EXPERTISE WITH PURPOSE</p>
          <h2>Specialized expertise. Clear financial direction.</h2>
          <p>
            Coordinated post-award support that connects your approved budget,
            supporting records, reimbursement requests, and financial reports.
          </p>
        </div>
        <div className="rail-toolbar">
          <p id="service-rail-hint">
            Seven services. One coordinated approach.
            <span>Swipe or use the arrows to explore.</span>
          </p>
          <div className="rail-controls">
            <button
              className="rail-arrow"
              aria-label="Previous services"
              disabled={bounds.start}
              onClick={() => move(-1)}
            >
              <ArrowLeft size={19} />
            </button>
            <button
              className="rail-arrow"
              aria-label="Next services"
              disabled={bounds.end}
              onClick={() => move(1)}
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
        <div
          ref={rail}
          id="service-rail"
          className="service-rail"
          role="region"
          aria-label="Browse advisory services"
          aria-describedby="service-rail-hint"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              move(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          {services.map((item, index) => {
            const CardIcon = icons[index];
            return (
              <Link
                className={`service-card ${selected === index ? "is-selected" : ""}`}
                to={`/#service-${index}`}
                key={item.title}
                aria-expanded={selected === index}
                aria-controls={
                  selected === index ? `service-${index}` : undefined
                }
              >
                <div className="card-top">
                  <CardIcon size={28} strokeWidth={1.3} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.short}</p>
                <span className="text-link">
                  Explore more <ArrowUpRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
        {service && selected !== null && (
          <article
            className="inline-service-detail"
            id={`service-${selected}`}
            tabIndex={-1}
            aria-labelledby="selected-service-title"
          >
            <div className="detail-topline">
              <span className="eyebrow">
                0{selected + 1} / ADVISORY SERVICES
              </span>
              <Link
                className="detail-close"
                to="/#services"
                aria-label="Close service details"
              >
                <X size={18} />
                <span>Close details</span>
              </Link>
            </div>
            <div className="service-detail">
              <div className="service-detail-title">
                {Icon && <Icon size={34} strokeWidth={1.2} />}
                <h3 id="selected-service-title">{service.title}</h3>
                <p>{service.description}</p>
                <Link
                  className="text-link"
                  to="/#contact"
                  state={{ service: service.title }}
                >
                  Discuss your needs <ArrowUpRight size={17} />
                </Link>
              </div>
              <div className="service-detail-copy">
                <h4>The challenge</h4>
                <p>{service.challenge}</p>
                <h4>How we help</h4>
                <p>{service.help}</p>
                <h4>What it means for your team</h4>
                <p>{service.benefit}</p>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
