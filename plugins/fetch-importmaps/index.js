const https = require("https");
const { parse } = require("url");
const fs = require("fs");

const api = (urlOptions, data) => {
  return new Promise((resolve, reject) => {
    const req = https.request(urlOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk.toString()));
      res.on("error", reject);
      res.on("end", () => {
        const response = {
          status: res.statusCode,
          headers: res.headers,
          body,
        };

        if (res.statusCode >= 200 && res.statusCode <= 299) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
    req.on("error", reject);
    req.write(data, "binary");
    req.end();
  });
};

function createParams(args) {
  const {
    IMPORTMAP_FILE_URL,
    IMPORTMAP_FILE,
    IMPORTMAP_SERVICE,
  } = global.process.env;

  const regexFile = RegExp(IMPORTMAP_FILE);

  const file = fs
    .readdirSync(args.netlifyConfig.build.publish)
    .find(regexFile.test.bind(regexFile));

  return {
    service: IMPORTMAP_SERVICE,
    url: IMPORTMAP_FILE_URL + file,
  };
}

module.exports = {
  onSuccess: async (args) => {
    const { IMPORTMAP_URL, IMPORTMAP_AUTH } = global.process.env;

    const params = createParams(args);

    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
    };

    console.log("PARAMS: ", params);

    if (IMPORTMAP_AUTH) {
      console.log("IMPORTMAP_AUTH: ", IMPORTMAP_AUTH);
      options.headers.authorization = IMPORTMAP_AUTH;
    }

    console.log("IMPORTMAP_URL: ", IMPORTMAP_URL);

    try {
      await api(
        Object.assign(options, parse(IMPORTMAP_URL)),
        JSON.stringify(params)
      );

      console.log("SUCCESS!");
    } catch (error) {
      console.log("ERROR:", error);
      throw error;
    }
  },
};
