// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: false,
      useBuiltIns: false
    }],
  ],
  plugins: [
    [
      "@discuzqfe/discuz-babel-plugin-import",
      {
        "libraryName": "@discuzqfe/design",
        "libraryDirectory": "dist-pure/components"
      }
    ]
  ]
};
