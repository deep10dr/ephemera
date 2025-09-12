"use client";

import dynamic from "next/dynamic";
import ErrorData from "@/animations/Error.json";
import Link from "next/link";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Error() {
  return (
    <div className="w-full min-h-screen p-4 flex flex-col justify-center items-center text-center">
      {/* Lottie Animation */}
      <Lottie animationData={ErrorData} loop className="w-80 h-80" />

      {/* Friendly Heading */}
      <h1 className="text-2xl font-bold mt-4">Oops! Something went wrong</h1>

      {/* Easy-to-understand explanation */}
      <p className="text-gray-600 mt-2 max-w-md">
        We couldn&apos;t load the page you were looking for. This might be due
        to a temporary issue or a broken link.
      </p>

      {/* Helpful actions */}
      <div className="flex gap-4 mt-4 ">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 cursor-pointer rounded-2xl"
        >
          Try Again
        </button>

        <button className="px-4 py-2 bg-gray-200 text-gray-800  hover:bg-gray-300 cursor-pointer rounded-2xl">
          Go Home
        </button>
      </div>
    </div>
  );
}
