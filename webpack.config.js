const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const path = require("path");
const { DefinePlugin } = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commitHash = require("child_process").execSync("git rev-parse --short HEAD").toString().trim();

// Export a function. Accept the base config as the only param.
module.exports = {
  entry: {
    main: ["./src/index.tsx", "./src/index.css"],
    editor: ["./src/editor.ts", "./src/editor.css"],
    about: ["./src/about.css"],
    "webpushr-sw": "./src/webpushr-sw.ts",
  },
  output: {
    filename: "[name].js",
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              configFile: "tsconfig.json",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new DefinePlugin({
      __COMMIT_HASH__: JSON.stringify(commitHash),
      __API_HOST__: JSON.stringify(
        process.env.NODE_ENV === "production" ? "https://api.liftosaur.com" : "http://local-api.liftosaur.com:8787"
      ),
      __HOST__: JSON.stringify(
        process.env.NODE_ENV === "production" ? "https://www.liftosaur.com" : "http://local.liftosaur.com:8080"
      ),
    }),
    new CopyPlugin([
      {
        from: `src/index.html`,
        to: `index.html`,
        transform: (content) => {
          return content.toString().replace(/\?version=xxxxxxxx/g, `?version=${commitHash}`);
        },
      },
      {
        from: `src/editor.html`,
        to: `editor.html`,
      },
      {
        from: `src/about.html`,
        to: `about/index.html`,
        transform: (content) => {
          return content.toString().replace(/\?version=xxxxxxxx/g, `?version=${commitHash}`);
        },
      },
      {
        from: `src/about.css`,
        to: `about.css`,
      },
      {
        from: `docs`,
        to: `docs`,
      },
      {
        from: `src/googleauthcallback.html`,
        to: `googleauthcallback.html`,
      },
      {
        from: `src/privacy.html`,
        to: `privacy.html`,
      },
      {
        from: `src/terms.html`,
        to: `terms.html`,
      },
      {
        from: `src/notification.m4r`,
        to: `notification.m4r`,
      },
      {
        from: "icons",
        to: "icons",
      },
      {
        from: "fonts",
        to: "fonts",
      },
      {
        from: "images",
        to: "images",
      },
      {
        from: "manifest.webmanifest",
        to: "manifest.webmanifest",
      },
    ]),
    new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: false,
    inline: false,
    liveReload: false,
    host: "0.0.0.0",
    disableHostCheck: true,
  },
};
