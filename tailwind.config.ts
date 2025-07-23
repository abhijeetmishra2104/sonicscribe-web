// tailwind.config.js
import { type Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],           // already used
        heading: ['var(--font-poppins)', 'sans-serif'],       // for <h1>, <h2>
        body: ['var(--font-source-sans)', 'sans-serif'],      // for general text
        serif: ['var(--font-source-serif)', 'serif'],         // for quotes/emphasis
      },
    },
  },
  // ...other config
};

export default config;
