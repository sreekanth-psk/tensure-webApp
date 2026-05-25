import type { MouseEvent } from "react";

export function scrollToSection(
  e: MouseEvent<HTMLAnchorElement>,
  href: string
) {
  e.preventDefault();
  const targetId = href.replace("#", "");
  const element = document.getElementById(targetId);
  if (!element) return;

  const headerOffset = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  window.history.pushState(null, "", href);
}
