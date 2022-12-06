const { createBrotliCompress, createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');
const {
    createReadStream,
    createWriteStream,
} = require('node:fs');

exports.compressFileBrotli = (fileName) => {
    const brotli = createBrotliCompress();
    const source = createReadStream(`raw_files/${fileName}`);
    const destination = createWriteStream(`compress_files/${fileName}.br`);

    // Pipe the read and write operations with brotli compression
    return source.pipe(brotli).pipe(destination);
}

exports.compressFileGzip = (fileName) => {
    const gzip = createGzip();
    const source = createReadStream(`raw_files/${fileName}`);
    const destination = createWriteStream(`compress_files/${fileName}.gz`);

    // Pipe the read and write operations with brotli compression
    return source.pipe(gzip).pipe(destination);
}