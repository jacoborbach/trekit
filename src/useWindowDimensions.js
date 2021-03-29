import { useState, useEffect } from 'react';

export default function useWindowDimensions() {

  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    let device;
    let orientation;
    if (width > height) {
      orientation = 'landscape'
    } else if (height > width) {
      orientation = 'portrait'
    }
    if (width >= 1200) {
      device = 'laptop'
    } else if (width >= 815 && width < 1200) {
      device = 'tablet'
    } else if (width > 700 && width < 815) {
      device = 'largeMobile'
    } else if (width > 0 && width <= 700) {
      device = 'smallMobile'
    }

    return {
      orientation,
      device,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return (windowDimensions)
}