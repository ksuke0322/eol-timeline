// husky設定参考 : https://zenn.dev/resistance_gowy/articles/91b4f62b9f48ec

const buildEslintCommand = (filenames) =>
  `eslint -- ${filenames.map((f) => f).join(" ")}`;

module.exports = {
  // https://zenn.dev/d3g/scraps/a41dca9a3ecda8
  "*.{ts,tsx}": [() => "pnpm tsc", "pnpm lint --", "prettier --write"],
};
