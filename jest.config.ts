import type { Config } from "jest";

const config: Config = {
  projects: [
    {
      displayName: "node",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/lib/__tests__/**/*.test.ts"],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
    },
    {
      displayName: "jsdom",
      preset: "ts-jest",
      testEnvironment: "jest-environment-jsdom",
      testMatch: ["<rootDir>/src/components/__tests__/**/*.test.tsx"],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    },
  ],
};

export default config;
