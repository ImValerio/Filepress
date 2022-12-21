export const getFileExt = (fileName:string)=>{
    const dotIndex = fileName.lastIndexOf(".")
    if(!dotIndex) return null
    return fileName.substring(dotIndex,fileName.length)
}