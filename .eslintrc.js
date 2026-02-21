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
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': ['error', { functions: false, classes: false }],
    'import/prefer-default-export': 'off',
  },
  overrides: [
    {
      files: ['server/**/*.js'],
      env: { node: true, browser: false },
      rules: {
        'no-console': 'off',
        'no-restricted-syntax': 'off',
        'no-continue': 'off',
        'no-await-in-loop': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
      },
    },
  ],
};
