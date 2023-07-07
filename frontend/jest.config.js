module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: [
    'src/**/GameInfoBox.tsx',
    '!src/shared/gameInfoBox/CodeBtn.tsx', // exclude CodeBtn.tsx
    '!src/shared/gameInfoBox/GameInfoBox.css', // exclude GameInfoBox.css
  ],
};