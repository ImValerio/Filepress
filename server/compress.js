const { createBrotliCompress, createGzip, brotliDecompress, createGunzip } = require('node:zlib');
const { pipeline } = require('node:stream');
const {
    createReadStream,
    createWriteStream,
} = require('node:fs');
const fs = require("fs");
const path = require("path");
const {createTmpFolder, removeLastExt} = require("./utils");
const {promisify} = require('util');

exports.compressFileBrotli = (file) => {
    const brotli = createBrotliCompress();
    const pathSource = path.join("raw_files",file.fileNameOrig)
    const pathDestination = path.join("results",file.fileNameProcessed)

    const source = createReadStream(pathSource);
    const destination = createWriteStream(pathDestination);

    // Pipe the read and write operations with brotli compression
    return source.pipe(brotli).pipe(destination);
}

exports.decompressFileBrotli = async (file) => {
    const inputFile = path.join("raw_files",file.fileNameOrig)
    const outputFile = path.join("results",file.fileNameProcessed)

    const data = await promisify(fs.readFile)(inputFile)
    const result = await promisify(brotliDecompress)(data)
    return promisify(fs.writeFile)(outputFile, result)
}

exports.compressFileGzip = (file) => {
    const gzip = createGzip({
        level: 8
    });

    const pathSource = path.join("raw_files",file.fileNameOrig)
    const pathDestination = path.join("results",file.fileNameProcessed)

    const source = createReadStream(pathSource);
    const destination = createWriteStream(pathDestination);
    // Pipe the read and write operations with brotli compression
    return source.pipe(gzip).pipe(destination);
}

exports.decompressFileGzip =  (file) => {
    const gzip = createGunzip();

    const pathSource = path.join("raw_files",file.fileNameOrig)
    const pathDestination = path.join("results",file.fileNameProcessed)
    console.log(pathSource,pathDestination)
    const source = createReadStream(pathSource);
    const destination = createWriteStream(pathDestination);

    // Pipe the read and write operations with brotli compression
    return source.pipe(gzip).pipe(destination);
}