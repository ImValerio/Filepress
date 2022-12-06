import {useState} from 'react'

const index = () => {
  const [algorithm, setAlgorithm] = useState("gzip")
  const [file,setFile] = useState(undefined)

  return (
    <div className="main-container">

      <div>

      <div id="dropContainer" >
        Drop Here
      </div>
      <input type="file" id="fileInput"  onChange={(e)=> setFile(e.target.files[0])}/>
      <select name="algorithms" id="algorithms" value={algorithm} onChange={(e)=> setAlgorithm(e.target.value)}>
        <option value="gzip" default>Gzip</option>
        <option value="brotli">Brotli</option>
      </select> 
      </div>
    </div>
  )
}

export default index