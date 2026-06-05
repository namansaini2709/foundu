import { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

const SmoothScroll = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Detect touch devices and mobile screens FIRST
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // If it's a mobile or touch device (Android/iOS), do absolutely nothing.
    // Let the native browser handle scrolling perfectly.
    if (isMobile || isTouch) {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
      return;
    }

    // Disable browser's automatic scroll restoration to prevent it fighting with Lenis (Desktop only)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (location.pathname.startsWith('/admin')) return;

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
  }, [location.pathname]);

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
