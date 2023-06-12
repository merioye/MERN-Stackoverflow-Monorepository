module.exports = {
  ...require('stackoverflow-config/jest-server'),
  rootDir: '.',
  setupFilesAfterEnv: ['./src/test-setup.ts'],
}
