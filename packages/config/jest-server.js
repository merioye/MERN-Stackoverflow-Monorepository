module.exports = {
  ...require('./jest-common'),
  coverageProvider: 'v8',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  moduleFileExtensions: ['js', 'json', 'ts'],
}
