import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { resolve } from 'node:path';

const tsconfigRootDir = resolve(process.cwd());

export default tseslint.config(
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '*.d.ts',
      'eslint.config.ts',
      'vite.config.ts',
    ],
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  js.configs.recommended,

  tseslint.configs.recommended,

  pluginVue.configs['flat/essential'],

  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json'],
        tsconfigRootDir: tsconfigRootDir,
      },
    },
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.json', './tsconfig.app.json'],
        tsconfigRootDir: tsconfigRootDir,
        extraFileExtensions: ['.vue'],
      },
    },
  }
);