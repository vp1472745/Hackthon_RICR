// Animation variants and theme constants for content components

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const iconHoverVariants = {
  hover: { scale: 1.15, rotate: 8, transition: { duration: 0.3, ease: "easeOut" } },
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

export const THEME = {
  primary: "#0B2A4A",
  accent: "#1D5B9B",
  gradientStart: "#F8FAFC",
  gradientEnd: "#E6F0FA",
};