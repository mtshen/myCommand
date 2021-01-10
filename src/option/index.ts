import * as fs from "fs";
import * as path from "path";

// 数据存写
export function getOption(optName) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'option.json'), "utf8", function(err, data) {
      if (err) {
        reject(err);
      } else {
        const option = JSON.parse(data);
        resolve(optName ? option[optName] : option);
      }
    });
  });
}

// 数据存写
export function setOption(optName, optData) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'option.json'), "utf8", function(err, data) {
      if (err) {
        reject(err);
      } else {
        const option = JSON.parse(data);
        Object.keys(optData).forEach((key) => {
          option[optName][key] = optData[key];
        });

        fs.writeFile(
          path.join(__dirname, 'option.json'),
          JSON.stringify(option),
          function(err) {
            resolve(void 0);
          }
        )
      }
    });
  });
}
