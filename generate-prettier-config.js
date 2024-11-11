const fs = require("fs");
const path = require("path");

// Read the package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

// Get all dependencies
const allDependencies = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {}),
];

// Filter and sort third-party dependencies
const thirdPartyModules = allDependencies
  .filter(
    (dep) =>
      !dep.startsWith("@/") &&
      dep !== "next" &&
      dep !== "react" &&
      dep !== "react-dom",
  )
  .sort();

// Create the Prettier configuration
const prettierConfig = {
  importOrder: [
    "^next",
    "^(react|react-dom)$",
    ...thirdPartyModules.map((dep) => `^${dep}`),
    "^@/app/",
    "^@/components/",
    "^@/",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

// Write the configuration to .prettierrc
fs.writeFileSync(".prettierrc", JSON.stringify(prettierConfig, null, 2));

console.log("Prettier configuration generated!");
