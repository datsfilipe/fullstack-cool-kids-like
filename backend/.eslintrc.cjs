module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: "standard-with-typescript",
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        ".eslintrc.{js,cjs}"
      ],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "never"],
    "space-before-function-paren": ["error", "never"],
    indent: ["error", 2],
    "@typescript-eslint/quotes": "off"
  }
}
