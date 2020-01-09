const fs = require("fs");
const glob = require("glob");
const path = require("path");

/**
 * C O N F I G
 * 
 * * startPath = select folder from which script starts refactoring
 * * regexForModules = modules name to map from (probably specified in jsconfig.json) 
 */

const startPath = "/Users/dzanek/code/frontend/src/mmb";
const regexForModules = /.+?\/(?=mmb\/|booking\/|content\/|mocks\/|common\/)/g;

const regexForRelativeImport = /(^import .*)(?="\.*\/.*").*|(^}.from )(?="\.*\/.*").*/gm;
const regexForInsideQuotes = /(?<=")(?:\\.|[^"\\])*(?=")/g;
const getDirectories = (src, callback) => {
  glob(src + "/**/*", callback);
};

const processFile = pathToFile => {
  fs.readFile(pathToFile, (err, data) => {
    const fileContent = data.toString();
    const replacedContent = fileContent.replace(
      regexForRelativeImport,
      matched => {
        return matched.replace(regexForInsideQuotes, relativePath => {
          const pathToActualFolder = path.parse(pathToFile).dir;
          const absoluteImportPath = path.resolve(
            pathToActualFolder,
            relativePath
          );
          const pathAfterSrc = absoluteImportPath.replace(regexForModules, "");
          if (pathAfterSrc.startsWith("/")) {
            return relativePath;
          }
          return pathAfterSrc;
        });
      }
    );

    fs.writeFile(
      pathToFile,
      replacedContent,
      err => err && console.log("error ", err)
    );
  });
};

const processFiles = filesArray => {
  const edited = filesArray.map(
    file => file.endsWith(".js") && processFile(file)
  );
};

getDirectories(startPath, (err, res) =>
  err ? console.log(err) : processFiles(res)
);
