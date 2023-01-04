const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const path = require("path");
const fs = require("fs");

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/raw_files')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage:storage })

const app = express();

app.use(express.static(path.join(__dirname,"download")))

const { compressFileGzip, compressFileBrotli, decompressFileGzip, decompressFileBrotli } = require('./compress')
const {createTmpFolder, mvProcessedFileToDownload, removeLastExt, rmDownloadAfter5min, FileInfo} = require("./utils");

app.use(morgan('tiny'));
app.use(cors())

const PORT = process.env.PORT | 5050;


app.post('/compress/:type',upload.single('file'), async (req, res) => {
    const {type} = req.params;

    const fileName = req.file.originalname
    const compressedFileName = type === "brotli" ? fileName+".br" : fileName+".gz"

    const file = new FileInfo(fileName,compressedFileName)

    try{
        const stream = type === "brotli" ? compressFileBrotli(file) : compressFileGzip(file);
        const dateStart = new Date().getTime();
        const tmpFolderPath = createTmpFolder();

        stream.on('finish', () => {

            const downloadLink = mvProcessedFileToDownload(file, tmpFolderPath)
            const computeTimeInMs = new Date().getTime() - dateStart;

            rmDownloadAfter5min(tmpFolderPath);

            res.status(200).json({
                msg: "File compressed successfully!",
                downloadLink,
                timeToExecute: `${computeTimeInMs / 1000}s, ${computeTimeInMs}ms `
            })

        })
    }catch(err){
        res.status(500).json({error: 'Internal server error'})

        console.log(err.message);
    }

})

app.post('/decompress/:type',upload.single('file'), async (req, res) => {
    const {type} = req.params;

    const fileName = req.file.originalname
    const decompressedFileName = removeLastExt(fileName)


    const file = new FileInfo(fileName,decompressedFileName)

    try{
        let computeTimeInMs,downloadLink;
        const dateStart = new Date().getTime();
        const tmpFolderPath = createTmpFolder();

        if(type === "brotli"){
             await decompressFileBrotli(file)
            computeTimeInMs = new Date().getTime() - dateStart;
            downloadLink = mvProcessedFileToDownload(file,tmpFolderPath)

            res.status(200).json({
                msg: "File compressed successfully!",
                downloadLink,
                timeToExecute: `${computeTimeInMs / 1000}s, ${computeTimeInMs}ms `
            })

        }else{
            const stream = decompressFileGzip(file);

            stream.on('finish', () => {

                downloadLink = mvProcessedFileToDownload(file,tmpFolderPath)
                computeTimeInMs = new Date().getTime() - dateStart;

                rmDownloadAfter5min(tmpFolderPath);
                res.status(200).json({
                    msg: "File compressed successfully!",
                    downloadLink,
                    timeToExecute: `${computeTimeInMs / 1000}s, ${computeTimeInMs}ms `
                })
            })
        }

    } catch (err){
        console.log(err)
        res.status(500).json({error: 'Internal server error'})
    }
})

app.get('/download/:folder/:fileName', function(req, res){
    const {folder, fileName} = req.params;
    const file = `${__dirname}/download/${folder}/${fileName}`;

    res.download(file);
});

app.listen(PORT, console.log(`===> Listening on port ${PORT}`));