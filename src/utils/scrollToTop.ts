
export const scrollToTop = () => {
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });
};

// Alternative immediate scroll for cases where smooth scrolling isn't needed
export const scrollToTopImmediate = () => {
  window.scrollTo(0, 0);
};
