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

    if (location.pathname.startsWith('/admin') || location.pathname === '/founder-ai') return;

    const lenis = new Lenis({
      lerp: 0.1, // Smooth scrolling
      smoothWheel: true,
      autoRaf: true, // Let Lenis handle the requestAnimationFrame internally (default in 1.3+)
    });

    // Initial scroll reset
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle route change scroll reset separately to avoid re-initializing Lenis
  useEffect(() => {
    // Small timeout ensures the DOM has updated before we scroll
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      // If lenis exists on the global scope or via a ref, we'd use it here. 
      // Since it's destroyed/re-init in the other effect (which we fixed), 
      // we can just use the native scroll reset which Lenis will pick up on next frame.
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
