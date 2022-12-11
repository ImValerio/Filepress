const express = require('express');
const morgan = require('morgan')
const cors = require('cors');

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

const { compressFileGzip, compressFileBrotli, decompressFileGzip, decompressFileBrotli } = require('./compress')

app.use(morgan('tiny'));
app.use(cors())

const PORT = process.env.PORT | 5050;


app.post('/compress/:type',upload.single('file'), async (req, res) => {
    const {type} = req.params;
    const fileName = req.file.originalname

    const stream = type === "brotil" ? compressFileBrotli(fileName) : compressFileGzip(fileName);
    const dateStart = new Date().getTime();

    stream.on('finish', () => {
        const computeTimeInMs = new Date().getTime() - dateStart;
        res.status(200).json({
            msg: "File compressed successfully!",
            timeToExecute: `${computeTimeInMs / 1000}s, ${computeTimeInMs}ms `
        })

    })
})

app.post('/decompress/:type',upload.single('file'), async (req, res) => {
    const {type} = req.params;
    const fileName = req.file.originalname

    const stream = type === "brotil" ? decompressFileBrotli(fileName) : decompressFileGzip(fileName);
    const dateStart = new Date().getTime();

    stream.on('finish', () => {
        const computeTimeInMs = new Date().getTime() - dateStart;
        res.status(200).json({
            msg: "File compressed successfully!",
            timeToExecute: `${computeTimeInMs / 1000}s, ${computeTimeInMs}ms `
        })

    })

})

app.listen(PORT, console.log(`===> Listening on port ${PORT}`));