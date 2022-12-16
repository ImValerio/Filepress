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
const {createTmpFolder, mvProcessedFileToDownload, removeLastExt} = require("./utils");

app.use(morgan('tiny'));
app.use(cors())

const PORT = process.env.PORT | 5050;


app.post('/compress/:type',upload.single('file'), async (req, res) => {
    const {type} = req.params;
    const fileName = req.file.originalname

    try{
        const stream = type === "brotil" ? compressFileBrotli(fileName) : compressFileGzip(fileName);
        const dateStart = new Date().getTime();
        const tmpFolderPath = createTmpFolder(fileName);
        const compressedFileName = fileName+".gz"

        stream.on('finish', () => {

            const downloadLink = mvProcessedFileToDownload(compressedFileName, tmpFolderPath,1)
            const computeTimeInMs = new Date().getTime() - dateStart;

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

    try{
        const stream = type === "brotil" ? decompressFileBrotli(fileName) : decompressFileGzip(fileName);
        const dateStart = new Date().getTime();
        const tmpFolderPath = createTmpFolder(fileName);
        const decompressedFileName = removeLastExt(fileName)

        stream.on('finish', () => {
            const computeTimeInMs = new Date().getTime() - dateStart;

            const downloadLink = mvProcessedFileToDownload(decompressedFileName,tmpFolderPath, 0)

            res.status(200).json({
                msg: "File compressed successfully!",
                downloadLink,
                timeToExecute: `${computeTimeInMs / 1000}s, ${computeTimeInMs}ms `
            })

        })
    }catch (err){
        res.status(500).json({error: 'Internal server error'})
        console.log(err)
    }


})

app.get('/download/:folder/:fileName', function(req, res){
    const {folder, fileName} = req.params;
    const file = `${__dirname}/download/${folder}/${fileName}`;
    res.download(file); // Set disposition and send it.

});

app.listen(PORT, console.log(`===> Listening on port ${PORT}`));