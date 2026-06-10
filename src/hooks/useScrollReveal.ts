import { useEffect, useRef } from 'react';

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    const revealElements = element.querySelectorAll('.reveal, .reveal-stagger');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
