// const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
    plugins: [
      require("postcss-import")(),
      require("postcss-preset-env")(),
      require("autoprefixer"),
      require("postcss-nested")(),
      require("tailwindcss"),
      // purgecss({
      //   content: ["layouts/**/*.html"],
      //   defaultExtractor: content => content.match(/[A-z0-9-:\/%]+/g) || [],
      //   fontFace: false,
      //   whitelist: ["w-10/100", "w-20/100", "w-25/100", "w-30/100", "w-33/100", "w-40/100", "w-45/100", "w-50/100", "w-55/100", "w-60/100", "w-66/100", "w-70/100", "w-75/100", "w-80/100", "w-90/100", "w-100/100", "mt--50", "mt--100", "mt--200", "mt-50", "mt-100", "mt-200", "mt-300", "mt-400", "mt-500", "mt-600", "mt-700", "mt-800", "mt-900", "mt-1000", "mt-0", "ml-0%", "ml-5%", "ml-10%", "ml-15%", "ml-20%", "ml-25%", "ml-30%", "ml-35%", "ml-40%", "ml-45%", "ml-50%", "ml-55%", "ml-60%", "ml-65%", "ml-70%", "ml-75%", "ml-80%", "ml-85%", "ml-90%", "ml-95%", "ml-100%", "mr-0%", "mr-5%", "mr-10%", "mr-15%", "mr-20%", "mr-25%", "mr-30%", "mr-35%", "mr-40%", "mr-45%", "mr-50%", "mr-55%", "mr-60%", "mr-65%", "mr-70%", "mr-75%", "mr-80%", "mr-85%", "mr-90%", "mr-95%", "mr-100%", "self-start", "self-center", "self-end", "text-xs", "text-sm", "text-base", "text-lg", "text-2xl", "text-4xl", "text-6xl", "text-7xl", "text-8xl", "text-9xl", "text-10xl", "leading-none", "leading-tight", "leading-snug", "leading-normal", "leading-relaxed", "leading-loose", "tracking-tighter", "tracking-tight", "tracking-normal", "tracking-wide", "tracking-wider", "tracking-widest", "text-left", "text-center", "text-right", "text-justified", "font-hairline", "font-light", "font-normal", "font-semibold", "font-bold", "font-extrabold"]
      // }),
    ]
  };