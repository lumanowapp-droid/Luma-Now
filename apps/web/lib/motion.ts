import { Variants } from "framer-motion";

// Motion presets inspired by Apple, Notion, and Tiimo
// All animations use duration 0.15-0.25s, ease "easeOut", scale 0.97-1

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeOut" }
  }
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.15, ease: "easeOut" }
  }
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15, ease: "easeOut" }
  }
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.15, ease: "easeOut" }
  }
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.15, ease: "easeOut" }
  }
};

export const scalePress: Variants = {
  initial: { scale: 1 },
  animate: { scale: 1 },
  whileTap: {
    scale: 0.97,
    transition: { duration: 0.1, ease: "easeOut" }
  }
};

export const scaleHover: Variants = {
  initial: { scale: 1 },
  animate: { scale: 1 },
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.15, ease: "easeOut" }
  },
  whileTap: {
    scale: 0.97,
    transition: { duration: 0.1, ease: "easeOut" }
  }
};

export const layoutReflow: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeOut" }
  }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// Utility function for custom animations
export const createMotionVariant = (
  initial: any,
  animate: any,
  exit?: any
): Variants => ({
  initial,
  animate: {
    ...animate,
    transition: { duration: 0.2, ease: "easeOut", ...animate.transition }
  },
  exit: exit ? {
    ...exit,
    transition: { duration: 0.15, ease: "easeOut", ...exit.transition }
  } : undefined
});