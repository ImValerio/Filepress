const { createBrotliCompress, createGzip, brotliDecompress, createGunzip } = require('node:zlib');
const { pipeline } = require('node:stream');
const {
    createReadStream,
    createWriteStream,
} = require('node:fs');
const fs = require("fs");
const path = require("path");
const {createTmpFolder, removeLastExt} = require("./utils");

exports.compressFileBrotli = (file) => {
    const brotli = createBrotliCompress();
    const pathSource = path.join("raw_files",file.fileNameOrig)
    const pathDestination = path.join("results",file.fileNameProcessed)

    const source = createReadStream(pathSource);
    const destination = createWriteStream(pathDestination);

    // Pipe the read and write operations with brotli compression
    return source.pipe(brotli).pipe(destination);
}

exports.decompressFileBrotli = (fileName) => {
    const inputFile = path.join("raw_files",fileName)
    const outputFile = path.join("results",removeLastExt(fileName))

    console.log(inputFile,outputFile)

    fs.readFileSync(inputFile, (error, data) => {
        if (error) {
            console.error(error);
        } else {
            brotliDecompress(data, (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    fs.writeFile(outputFile, result, (error) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(`Decompressed file successfully written to ${outputFile}`);
                        }
                    });
                }
            });
        }
    })
}

exports.compressFileGzip = (file) => {
    const gzip = createGzip();

    const pathSource = path.join("raw_files",file.fileNameOrig)
    const pathDestination = path.join("results",file.fileNameProcessed)

    const source = createReadStream(pathSource);
    const destination = createWriteStream(pathDestination);
    // Pipe the read and write operations with brotli compression
    return source.pipe(gzip).pipe(destination);
}

exports.decompressFileGzip =  (fileName) => {
    const gzip = createGunzip();
    const source = createReadStream(`raw_files/${fileName}`);
    const dotIndex = fileName.lastIndexOf(".");
    const newFileName = fileName.substring(0, dotIndex)
    const destination = createWriteStream(`results/${newFileName}`);

    // Pipe the read and write operations with brotli compression
    return source.pipe(gzip).pipe(destination);
}