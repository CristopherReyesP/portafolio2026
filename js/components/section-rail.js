// Section rail: marks the section that crosses the middle of the viewport.
// Sections without a rail link (e.g. #brands) keep the previous item active.
function initSectionRail() {
  const rail = document.querySelector('.section-rail');
  if (!rail || !('IntersectionObserver' in window)) return;

  const linkBySection = new Map();
  rail.querySelectorAll('a[href^="#"]').forEach((link) => {
    const section = document.getElementById(link.getAttribute('href').slice(1));
    if (section) linkBySection.set(section, link);
  });

  const setActive = (active) => {
    linkBySection.forEach((link) => {
      const isActive = link === active;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(linkBySection.get(entry.target));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  linkBySection.forEach((_, section) => observer.observe(section));
}
