import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "public/**", "next-env.d.ts", "wordpress-integration/**"],
  },
  {
    rules: {
      // Apostrophes et guillemets français dans le JSX : rendus correctement, pas un bug
      "react/no-unescaped-entities": "off",
      // Dette existante, signalée sans bloquer la CI
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  {
    // Fichiers CommonJS (scripts Node, configuration Tailwind)
    files: ["**/*.js", "**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]

export default eslintConfig
