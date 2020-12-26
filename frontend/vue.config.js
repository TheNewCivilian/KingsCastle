module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/i,
          use: [
            {
              loader: 'raw-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
      ],
    },
  }
}