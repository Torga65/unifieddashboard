module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }],
    'linebreak-style': ['error', 'unix'],
    'no-param-reassign': [2, { props: false }],
    'no-console': 'off',
    'no-plusplus': 'off',
    radix: 'off',
    'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename'] }],
    'class-methods-use-this': 'off',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'consistent-return': 'off',
    'func-names': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['scripts/**/*.js'],
      env: { browser: true, node: true },
      rules: {
        'no-console': 'off',
        'no-plusplus': 'off',
        radix: 'off',
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'no-use-before-define': 'off',
        'consistent-return': 'off',
        'func-names': 'off',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      },
    },
  ],
};
