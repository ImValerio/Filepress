import {useState} from 'react'

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

        const res = await fetch(`http://localhost:5050/${mode}/${algorithm}`, {
          method: "POST",
          body: form,
        })
        const {downloadLink, timeToExecute} = await res.json();

        setDownloadLink(downloadLink);
        setTimeToExecute(timeToExecute);
    }

  return (
    <div className="main-container">

      <div className={'flex justify-center items-center flex-col'}>

      <div id="dropContainer" className={'flex justify-center items-center font-bold text-2xl uppercase w-full'} >
        Drop Here
      </div>
      <div className={'my-2 flex'}>
          <input type="file" id="fileInput"  onChange={(e)=> setFile(e.target.files[0])}/>
          <select className={'border-b-4 border-indigo-600'} name="algorithms" id="algorithms" value={algorithm} onChange={(e)=> setAlgorithm(e.target.value)}>
              <option value="gzip" >Gzip</option>
              <option value="brotli">Brotli</option>
          </select>
          <select className={' border-b-4 border-indigo-600 mx-2'} name="mode" value={mode} onChange={(e)=> setMode(e.target.value)}>
              <option value="compress" >Compress</option>
              <option value="decompress">Decompress</option>
          </select>
          <button className={'text-white bg-indigo-600 py-1 px-3'} onClick={handleSubmit}>UPLOAD</button>
      </div>
          {
              downloadLink && (
                  <div className="bg-gray-50 w-full">
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