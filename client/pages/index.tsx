import {useState} from 'react'
import 'animate.css';
import {getFileExt} from "../lib/utils";

const index = () => {
    const [algorithm, setAlgorithm] = useState("gzip")
    const [mode, setMode] = useState("compress")
    const [file,setFile] = useState(undefined)
    const [downloadLink, setDownloadLink] = useState("")
    const [timeToExecute, setTimeToExecute] = useState("")


    const serverURL = "http://localhost:5050"
    const handleSubmit = async()=>{
        setDownloadLink("")
        if(file == undefined) return;

        const form = new FormData()
        form.append('file', file)
        const xhr = new XMLHttpRequest();

        xhr.open('POST', `${serverURL}/${mode}/${algorithm}`, true);

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                console.log(`${percentComplete}% uploaded`);
            }
        };

        xhr.onload = async function () {
            if (xhr.status === 200) {
                const {downloadLink, timeToExecute} =  JSON.parse(xhr.response);

                setDownloadLink(downloadLink);
                setTimeToExecute(timeToExecute);
            }


        };

        xhr.send(form);
    }

    const handleChangeFile = (file:File)=>{
        setFile(file);

        const fileExt = getFileExt(file.name);

        if(fileExt === ".br"){
            setMode("decompress");
            setAlgorithm("brotli")
        }

        if(fileExt === ".gz"){
            setMode("decompress");
            setAlgorithm("gzip")
        }

    }

  return (
    <div className="main-container">

      <div className={'flex justify-center items-center flex-col'}>

      <div id="dropContainer" className={'flex justify-center items-center font-bold text-2xl uppercase w-full'} >
        Drop Here
      </div>
      <div className={'my-2 flex items-center'}>
          <input type="file" id="fileInput"  onChange={(e)=> handleChangeFile(e.target.files[0])}/>
          <select className={'border-b-4 border-indigo-600'} name="algorithms" id="algorithms" value={algorithm} onChange={(e)=> setAlgorithm(e.target.value)}>
              <option value="gzip" >Gzip</option>
              <option value="brotli">Brotli</option>
          </select>
          <select className={' border-b-4 border-indigo-600 mx-2'} name="mode" value={mode} onChange={(e)=> setMode(e.target.value)}>
              <option value="compress" >Compress</option>
              <option value="decompress">Decompress</option>
          </select>
          <button className={'text-white bg-indigo-600 px-4 py-1 rounded-sm '} onClick={handleSubmit}>UPLOAD</button>
      </div>
          {
              downloadLink && (
                  <div className="bg-gray-50 w-full animate__animated animate__fadeInUp">
                      <div
                          className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
                          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                              <span className="block">File {mode}ed</span>
                              <span className="block text-indigo-600">in {timeToExecute}</span>
                          </h2>
                          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">

                              <div className="ml-3 inline-flex rounded-md shadow">
                                  <a href={serverURL+downloadLink}
                                     className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
                                     download>DOWNLOAD</a>
                              </div>
                          </div>
                      </div>
                  </div>
              )
          }

      </div>


    </div>
  )
}

export default index