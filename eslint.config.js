// ESLint 9+ Flat Config Format
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'release-builds/**',
      'coverage/**',
      'dist/**',
      'build/**',
      '**/*.min.js',
      'assets/js/ie/**',
      'assets/js/jquery*.js',
      'assets/js/skel*.js',
      'assets/js/util.js',
      'scheduling/MindFusion.Scheduling.js',
      '.eslintrc.js',
      '.prettierrc.js',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
];
