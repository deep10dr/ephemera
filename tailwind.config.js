

/** @type {import('tailwindcss').Config} */
export const content = [
  "./node_modules/@heroui/theme/dist/components/(input-otp|form).js",
];
export const theme = {
  extend: {},
};
export const darkMode = "class";
export const plugins = [heroui()];
