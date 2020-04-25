const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("postcss-import")(),
    require("postcss-preset-env")(),
    require("autoprefixer"),
    require("postcss-nested")(),
    require("tailwindcss"),
    purgecss({
      content: ["./dist/**/index.html"],
      defaultExtractor: content => content.match(/[A-z0-9-:\/%]+/g) || [],
      fontFace: false
    }),
  ]
};
