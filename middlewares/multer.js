const multer = require('multer')

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'text/xml' || file.mimetype === 'application/xml'){
       cb(null,true)
    }else{
       cb(new Error('only xml files are allowed'),false)
    }
 }
 
 const upload = (multer({
    fileFilter:fileFilter
 }))

 module.exports = upload