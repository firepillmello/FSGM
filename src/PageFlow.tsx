import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** One-time, transform-only entrances. Content is never hidden or faded out. */
export function PageFlow() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<Element>();
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    const start = () => {
      observer?.disconnect();
      if (preference.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || seen.has(entry.target)) continue;
            seen.add(entry.target);
            observer?.unobserve(entry.target);
            const animation = entry.target.animate(
              [
                { transform: "translateY(16px)" },
                { transform: "translateY(0)" },
              ],
              { duration: 620, easing: "cubic-bezier(.22,1,.36,1)" },
            );
            animations.add(animation);
            animation.addEventListener(
              "finish",
              () => animations.delete(animation),
              { once: true },
            );
          }
        },
        { threshold: 0.12 },
      );
      document
        .querySelectorAll(
          ".hero-copy h1, .community-visual, .section-heading, .story-copy h2, .director-note, .approach > div",
        )
        .forEach((element) => {
          if (!seen.has(element)) observer?.observe(element);
        });
    };
    const changed = () => {
      for (const animation of animations) animation.cancel();
      animations.clear();
      start();
    };
    start();
    preference.addEventListener("change", changed);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", changed);
      for (const animation of animations) animation.cancel();
    };
  }, [pathname]);
  return null;
}
