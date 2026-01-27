```typescript
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background))", // Fix: use rgb values from globals
                foreground: "rgb(var(--foreground))",
            },
        },
    },
    plugins: [],
};
export default config;

```
