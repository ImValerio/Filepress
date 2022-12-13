const {v4: uuidv4} = require("uuid");
const path = require("path");
const fs = require("fs");

exports.createTmpFolder = (fileName) => {
    const tmpFolderName = uuidv4();
    const folderPath = path.join(__dirname,"download",tmpFolderName)
    fs.mkdirSync(folderPath)

    return folderPath;
}