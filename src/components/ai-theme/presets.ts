import type { Variants } from "motion/react";

// Shared motion presets and class names for the AI-themed sign-in, sign-up and onboarding.

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Parent that reveals its motion children one after another. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** Child that fades in while rising slightly. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/**
 * Onboarding step container: slides and un-blurs in from the side the user is moving towards
 * (`custom` = 1 forward, -1 back) and reveals its motion children one by one.
 */
export const stepTransition: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: 28 * direction, filter: "blur(6px)" }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.32, ease: EASE_OUT, staggerChildren: 0.04, delayChildren: 0.03 },
    transitionEnd: { filter: "none" }, // keep text crisp once settled
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: -20 * direction,
    filter: "blur(4px)",
    transition: { duration: 0.16, ease: "easeIn" },
  }),
};

/** Child of `stepTransition`: fades in while rising slightly. */
export const stepItem: Variants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

/** Spring used for hover lifts and press feedback on cards and chips. */
export const PRESS_SPRING = { type: "spring", stiffness: 500, damping: 32 } as const;

/** Text link whose underline draws in from the left on hover and focus. */
export const animatedLinkClass =
  "relative font-medium text-foreground outline-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-(--ec-cyan) after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100";
