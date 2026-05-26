import { AnimatePresence, motion } from "motion/react";
import Icon from "../Icon/Icon";

export interface TooltipAnimationProps {
  isVisible: boolean;
}

export function TooltipAnimation({ isVisible }: TooltipAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="sui-pointer-events-none sui-absolute sui-inset-x-0 sui-bottom-full sui-z-[99999] sui-mb-1 sui-flex sui-items-center sui-justify-center"
        >
          <div className="sui-shadow-lg sui-flex sui-min-w-[80px] sui-flex-col sui-items-center sui-gap-0.5 sui-rounded-[12px] sui-bg-[#4c4c4c] sui-px-3 sui-py-1">
            <motion.div
              initial={{ opacity: 1, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, ease: [0.4, 0, 1, 1], duration: 0.1 }}
              className="sui-flex sui-flex-shrink-0 sui-items-center"
            >
              <Icon
                name="check_circle"
                filled
                className="sui-ml-auto sui-h-full sui-w-full sui-p-0 sui-text-positive-background-weak"
              />
            </motion.div>
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.1 }}
              className="sui-leading-4 sui-text-[12px] sui-font-normal sui-text-white"
            >
              Copied!
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
