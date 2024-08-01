module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true, // Add Jest environment
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
  plugins: ['@typescript-eslint', 'prettier', 'jest'], // Add Jest plugin
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
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
  ],
};
