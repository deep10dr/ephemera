"use client";

import dynamic from "next/dynamic";
import Greet from "../animations/Welcome.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
export default function Greeting() {
  return (
    <div>
      <Lottie animationData={Greet} loop={true}  />
    </div>
  );
}
