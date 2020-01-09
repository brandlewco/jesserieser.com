const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("postcss-import")(),
    require("postcss-preset-env")(),
    require("autoprefixer"),
    require("postcss-nested")(),
    require("tailwindcss"),
    purgecss({
      content: ["./**/*.html"]
    })
  ]
};
