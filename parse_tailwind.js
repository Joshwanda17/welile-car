const fs = require('fs');
const codeHtml = fs.readFileSync('landing_page_extracted/code.html', 'utf8');
const match = codeHtml.match(/tailwind\.config\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);
if (match) {
  let configStr = match[1];
  let configObj = eval('(' + configStr + ')');
  
  const newConfig = `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: ${JSON.stringify(configObj.theme.extend.colors, null, 6)},
      borderRadius: ${JSON.stringify(configObj.theme.extend.borderRadius, null, 6)},
      spacing: ${JSON.stringify(configObj.theme.extend.spacing, null, 6)},
      fontFamily: ${JSON.stringify(configObj.theme.extend.fontFamily, null, 6)},
      fontSize: ${JSON.stringify(configObj.theme.extend.fontSize, null, 6)},
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        "count-up": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "progress-fill": "progress-fill 1.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
} satisfies Config;
`;
  fs.writeFileSync('frontend/tailwind.config.ts', newConfig);
  console.log('Successfully updated tailwind.config.ts');
} else {
  console.log('Could not parse tailwind.config from HTML');
}
