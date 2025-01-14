module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:jsx-a11y/recommended', // Accessibility recommendations
      'prettier', // Enables prettier integration
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: ['react', 'import', 'jsx-a11y'],
    rules: {
      'react/prop-types': 'off', // Disable prop-types if using TypeScript
      'react/react-in-jsx-scope': 'off', // Not needed in modern React (since React 17+)
      'import/order': ['error', { groups: ['builtin', 'external', 'internal'] }],
      'jsx-a11y/alt-text': 'warn', // Ensure alt text for images
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    ignorePatterns: ['node_modules/', 'dist/', 'build/'],
  };
  