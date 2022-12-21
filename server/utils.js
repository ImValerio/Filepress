const {v4: uuidv4} = require("uuid");
const path = require("path");
const fs = require("fs");

exports.createTmpFolder = () => {
    const tmpFolderName = uuidv4();
    const folderPath = path.join(__dirname,"download",tmpFolderName)
    fs.mkdirSync(folderPath)

    return folderPath;
}
exports.mvProcessedFileToDownload = (file, tmpFolderPath)=>{

    const resultPath = path.join(__dirname,"results",file.fileNameProcessed)
    const downloadPath = path.join(tmpFolderPath,file.fileNameProcessed)
    // Remove old raw file
    fs.rename(resultPath,downloadPath,(err)=>{
        if (err) throw err

        fs.unlinkSync(path.join(__dirname,"raw_files", file.fileNameOrig))

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
    },5 * 60 * 1000)
}

exports.FileInfo = class FileInfo {
    constructor(fileNameOrig,fileNameProcessed) {
       this.fileNameOrig = fileNameOrig;
       this.fileNameProcessed = fileNameProcessed;
    }
}