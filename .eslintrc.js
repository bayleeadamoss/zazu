module.exports = {
  "parser": "babel-eslint",
  "extends": ["standard", "plugin:react/recommended"],
  "rules": { "comma-dangle": [2, "always-multiline"] },
  "plugins": [ "react" ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
  },
  "globals": {
    "newrelic": true,
    "__nr_require": true,
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "mocha": true,
    "node": true,
  }
};
