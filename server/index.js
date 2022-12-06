const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const app = express();

const { compressFileGzip, compressFileBrotli } = require('./worker')

app.use(morgan('tiny'));
app.use(cors())

const PORT = process.env.PORT | 5050;


app.get('/compress/:fileName/:type', async (req, res) => {
    const { fileName, type } = req.params;

    const stream = type == "brotil" ? compressFileBrotli(fileName) : compressFileGzip(fileName);
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