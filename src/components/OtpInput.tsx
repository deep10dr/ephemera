"use client";

import React, { useRef } from "react";

interface OtpInputProps {
  length?: number; // default = 4
  value: string;
  onChange: (val: string) => void;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const digit = e.target.value.replace(/[^0-9]/g, ""); // allow only digits
    const newValue = value.split("");
    newValue[index] = digit;
    onChange(newValue.join(""));

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-8 h-8 text-center text-xl border border-gray-400 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition p-0"
        />
      ))}
    </div>
  );
}
