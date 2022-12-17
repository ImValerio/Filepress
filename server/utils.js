const {v4: uuidv4} = require("uuid");
const path = require("path");
const fs = require("fs");

exports.createTmpFolder = (fileName) => {
    const tmpFolderName = uuidv4();
    const folderPath = path.join(__dirname,"download",tmpFolderName)
    fs.mkdirSync(folderPath)

    return folderPath;
}
//mode: 1 => compress   0 => decompress
exports.mvProcessedFileToDownload = (fileName, tmpFolderPath, mode)=>{

    const resultPath = path.join(__dirname,"results",fileName)
    const downloadPath = path.join(tmpFolderPath,fileName)
    // Remove old raw file
    fs.rename(resultPath,downloadPath,(err)=>{
        if (err) throw err

        const rmFileName = mode === 1 ? exports.removeLastExt(fileName) : fileName+".gz";

        fs.unlinkSync(path.join(__dirname,"raw_files", rmFileName))

    })
    return downloadPath.substring(downloadPath.indexOf("download") - 1, downloadPath.length)
}

exports.removeLastExt = (fileName)=>{
    const dot = fileName.lastIndexOf(".");
    return fileName.substring(0,dot)
}

exports.rmDownloadAfter5min = (tmpFolderPath)=>{
    setTimeout( ()=>{
        fs.rmdir(tmpFolderPath,{ recursive: true }, err => {
            if (err) {
                throw err
            }
        })
    },3* 1000)
}