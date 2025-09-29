"use client";
import NavBar from "@/components/navbar";
import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { SiNextbilliondotai } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { getUserWithExpiry } from "@/utils/storage";
import { useTheme } from "../context/ThemeContext";

import source1 from "../animations/secure.json";
import source from "../animations/secure1.json";
import source2 from "../animations/secure2.json";

export const stlyes = "";

export default function Page() {
  const data = useMemo(() => [source, source1, source2], []);
  const [current, setCurrent] = useState(0);
  const navigation = useRouter();
  const { theme, setTheme, themeValue } = useTheme();

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  }, [data.length]);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  }, [data.length]);

  function navigate() {
    const user_id = getUserWithExpiry("user");
    if (user_id != null) {
      navigation.push(`/${user_id.id}`);
    } else {
      navigation.push("/user");
    }
  }

  return (
    <div
      className={`w-full min-h-screen  flex flex-col items-center p-0 m-0 ${themeValue} `}
    >
      <NavBar />

      <div className="w-full flex flex-col items-center">
        {/* Animated Lottie Container */}
        <div className="relative md:w-[400px] md:h-[400px] w-60 h-60 md:mt-6 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
            >
              <Lottie
                animationData={data[current]}
                loop
                className="w-full h-full"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Text */}
        <motion.p
          className="mt-8 text-center  md:text-lg text-base max-w-xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Ephemera keeps your sensitive files safe with{" "}
          <span className="text-[#2563eb] font-semibold">
            end-to-end encryption
          </span>
          , auto-expiring links, and unmatched privacy.
        </motion.p>

        {/* Controls + CTA */}
        <div className="w-full flex flex-col items-center gap-10 mt-12">
          <div className="flex gap-8 items-center">
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition shadow-md"
            >
              <GrFormPrevious className="text-2xl text-cyan-400" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition shadow-md"
            >
              <GrFormNext className="text-2xl text-cyan-400" />
            </button>
          </div>

          <motion.button
            onClick={navigate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-2xl text-black font-bold flex items-center 
                       bg-gradient-to-r from-cyan-400 to-blue-500 
                       hover:from-cyan-300 hover:to-blue-400
                       shadow-lg transition"
          >
            Get Started
            <SiNextbilliondotai className="ml-2 text-xl" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
