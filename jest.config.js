module.exports = {
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lodash|lodash-es))'],
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testPathIgnorePatterns: ['<rootDir>/.history/', '<rootDir>/node_modules/'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
