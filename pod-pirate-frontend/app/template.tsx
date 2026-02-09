"use client";
import { motion } from "framer-motion";
import { AppProgressBar } from "next-nprogress-bar";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="pb-2"
    >
      <AppProgressBar
        height="3px"
        color="#2563eb"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </motion.div>
  );
}
