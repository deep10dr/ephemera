"use client";
import loadingData2 from "../animations/Loader-cat.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center  z-50">
      <Lottie
        animationData={loadingData2}
        loop={true}
        className="w-120 h-120 invert-100"
      />
    </div>
  );
}
