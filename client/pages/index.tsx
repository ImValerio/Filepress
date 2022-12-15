import {useState} from 'react'

const index = () => {
  const [algorithm, setAlgorithm] = useState("gzip")
    const [mode, setMode] = useState("compress")
    const [file,setFile] = useState(undefined)
    const [downloadLink, setDownloadLink] = useState("")

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
        const {downloadLink} = await res.json();

        setDownloadLink(downloadLink);
    }

  return (
    <div className="main-container">

      <div>

      <div id="dropContainer" >
        Drop Here
      </div>
      <input type="file" id="fileInput"  onChange={(e)=> setFile(e.target.files[0])}/>
      <select name="algorithms" id="algorithms" value={algorithm} onChange={(e)=> setAlgorithm(e.target.value)}>
        <option value="gzip" >Gzip</option>
        <option value="brotli">Brotli</option>
      </select>
          <select name="mode" value={mode} onChange={(e)=> setMode(e.target.value)}>
              <option value="compress" >Compress</option>
              <option value="decompress">Decompress</option>
          </select>
        <button onClick={handleSubmit}>upload</button>
          {downloadLink && <a href={serverURL+downloadLink}>DOWNLOAD</a>}
      </div>
    </div>
  )
}

export default index