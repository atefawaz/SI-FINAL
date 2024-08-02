module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' type
    '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars
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
  },
  globals: {
    module: 'writable',
    require: 'writable',
    process: 'writable',
  },
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
      },
      globals: {
        module: 'writable',
        require: 'writable',
        process: 'writable',
      },
    },
    // Specific overrides for your problematic files
    {
      files: ['src/controllers/auth.controller.ts'],
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
    {
      files: ['src/types/express.d.ts', 'src/types/session.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
