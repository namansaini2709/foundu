import { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

const SmoothScroll = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration to prevent it fighting with Lenis
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (location.pathname.startsWith('/admin')) return;

    // Detect touch devices and mobile screens
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Skip JS smooth scrolling entirely on mobile/touch for better native performance (fixes Safari/Mobile issues)
    if (isMobile || isTouch) {
      document.documentElement.style.scrollBehavior = 'smooth';
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1, // Smooth scrolling
      smoothWheel: true,
      smoothTouch: false, // Ensure touch scrolling is native
      syncTouch: false, // Do not sync touch events
      autoRaf: true, // Let Lenis handle the requestAnimationFrame internally
    });

    // Initial scroll reset
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle route change scroll reset separately
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
