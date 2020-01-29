const { compilerOptions } = require('./tsconfig');
const { resolve } = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: "../coverage",
  rootDir: "src",
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  moduleNameMapper: {
    "^@abstract/(.*)$": resolve(__dirname, "./src/abstractions/$1"),
    "^@cart/(.*)$": resolve(__dirname, "./src/cart/$1"),
    "^@currency/(.*)$": resolve(__dirname, "./src/currency/$1"),
    "^@cron/(.*)$": resolve(__dirname, "./src/cron/$1"),
    "^@decorators/(.*)$": resolve(__dirname, "./src/decorators/$1"),
    "^@entities/(.*)$": resolve(__dirname, "./src/entities/$1"),
    "^@product/(.*)$": resolve(__dirname, "./src/product/$1"),
    "^@server/(.*)$": resolve(__dirname, "./src/server/$1"),
  },
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
};
