const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const WebpackGitHash = require("webpack-git-hash");
const fs = require("fs");

function removeExternalReact(defaultConfig) {
  defaultConfig.externals = defaultConfig.externals.filter(
    (external) => !RegExp("react").test(external)
  );
}

function getOutput(defaultConfig) {
  if (global.process.env.WEBPACK_DEV_SERVER === "true") {
    return {};
  }

  return {
    filename: `[githash].${defaultConfig.output.filename}`,
  };
}

function getHttps() {
  if (global.process.env.WEBPACK_DEV_SERVER === "true") {
    return {
      key: fs.readFileSync("./certificates/cert-key.pem"),
      cert: fs.readFileSync("./certificates/cert.pem"),
    };
  }

  return {};
}

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "single-spa-books",
    projectName: "home",
    webpackConfigEnv,
  });

  removeExternalReact(defaultConfig);

  return webpackMerge.smart(defaultConfig, {
    devServer: {
      hot: true,
      https: getHttps(),
    },
    output: getOutput(defaultConfig),
    plugins: [new WebpackGitHash()],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
    },
  });
};
