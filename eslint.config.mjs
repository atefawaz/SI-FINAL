import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      sourceType: 'module',
      parser: tsParser,
      globals: {
        ...globals.node,
        module: 'writable',
        require: 'writable',
        process: 'writable',
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tsEslint,
      prettier: prettier,
    },
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops are not allowed',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are not allowed',
        },
        {
          selector: 'WithStatement',
          message: 'with statements are not allowed',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' type
      '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars
      ...pluginJs.configs.recommended.rules,
      ...tsEslint.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Specific overrides for your problematic files
  {
    files: ['src/controllers/auth.controller.ts', 'src/types/express.d.ts', 'src/types/session.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['src/controllers/movies.controller.ts', 'src/middleware/authentication.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
