import { dirname } from "path"
import { fileURLToPath } from "url"

import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable some common ESLint rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/prefer-as-const": "off",
      
      // React specific rules
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "warn", // Change from error to warning
      
      // Next.js specific rules
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      
      // General JavaScript rules
      "no-console": "off",
      "no-debugger": "warn",
      "no-unused-vars": "off",
      "prefer-const": "warn",
      "no-var": "warn",
      
      // Import rules
      "import/no-anonymous-default-export": "off",
      
      // Accessibility rules (if you want to be less strict)
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
]

export default eslintConfig
