const { createBrotliCompress, createGzip, brotliDecompress, createGunzip } = require('node:zlib');
const { pipeline } = require('node:stream');
const {
    createReadStream,
    createWriteStream,
} = require('node:fs');
const fs = require("fs");

exports.compressFileBrotli = (fileName) => {
    const brotli = createBrotliCompress();
    const source = createReadStream(`raw_files/${fileName}`);
    const destination = createWriteStream(`results/${fileName}.br`);

    // Pipe the read and write operations with brotli compression
    return source.pipe(brotli).pipe(destination);
}

exports.decompressFileBrotli = (fileName) => {
    //TODO: fix decompress passing right param type in brotliDecompress function
    const source = createReadStream(`results/${fileName}`);

    const brotli = brotliDecompress();
    const destination = createWriteStream(`raw_files/${fileName}`);

    // Pipe the read and write operations with brotli compression
    return source.pipe(brotli).pipe(destination);
}

exports.compressFileGzip = (fileName) => {
    const gzip = createGzip();
    const source = createReadStream(`raw_files/${fileName}`);
    const destination = createWriteStream(`results/${fileName}.gz`);

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