module.exports = {
  parser: 'babel-eslint',
  extends: ['standard', 'plugin:react/recommended'],
  rules: { 'comma-dangle': [2, 'always-multiline'] },
  plugins: ['react', 'html'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '16.8.6',
    },
  },
  globals: {
    newrelic: true,
    __nr_require: true,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    node: true,
  },
}
