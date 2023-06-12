module.exports = {
  ...require('./jest-common'),
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['**/src/**/*.{js,ts,jsx,tsx}'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
}
