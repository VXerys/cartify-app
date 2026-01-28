// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // Disable import/namespace rule - causes false positives with TypeScript JSX
    rules: {
      'import/namespace': 'off',
    },
  },
]);
