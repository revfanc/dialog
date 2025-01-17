module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./.babelrc" }],
    "^.+\\.jsx$": ["babel-jest", { configFile: "./.babelrc" }],
    "^.+\\.vue$": "@vue/vue2-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/tests/mocks/styleMock.js",
  },
  testMatch: ["<rootDir>/tests/**/*.spec.js"],
  transformIgnorePatterns: ['/node_modules/(?!(@vue/test-utils|vue-jest)/)']
};
