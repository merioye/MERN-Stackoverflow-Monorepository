const path = require('path')

const fromRoot = (d) => path.join(__dirname, d)

module.exports = {
  roots: [
    fromRoot('apps/node-auth-service'),
    fromRoot('apps/node-qna-service'),
    fromRoot('apps/node-tag-service'),
  ],
  resetMocks: true,
  coveragePathIgnorePatterns: [],
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts,tsx}'],
  coverageThreshold: null,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    '@src/(.*)': fromRoot('apps/next-app/src/$1'),
  },
}
