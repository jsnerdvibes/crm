import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Base JS rules
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.node,   // 👈 IMPORTANT for backend
      },
    },
  },

  // CommonJS support
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },

  // TypeScript rules
  ...tseslint.configs.recommended,

  // 🔥 Backend-specific overrides (THIS IS THE KEY)
  {
    files: ['**/*.ts'],
    rules: {
      // Allow unused params prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Still forbid `any`, but allow controlled escape hatches
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          ignoreRestArgs: true,
        },
      ],
    },
  },
]);
