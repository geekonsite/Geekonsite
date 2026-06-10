import { useCallback, useRef } from 'react';

export function useTilt(maxTilt = 8) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      const highlight = card.querySelector('.tilt-highlight') as HTMLElement;
      if (highlight) {
        highlight.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        highlight.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      }
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return { cardRef, handleMouseMove, handleMouseLeave };
}
