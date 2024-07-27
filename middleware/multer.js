import multer from 'multer';

const storage = multer.diskStorage({
    // Set the destination
    destination: function (req, file, cb) {
      cb(null, 'Uploads') // path of image where image save
    },
    // set the file name 
    filename: function (req, file, cb) {
      const fname = `image-${Date.now()}.${file.originalname}` ;    // file name depends on u in which way u want to save the filename
      cb(null,fname)
    }
  });

//   Filte the image

const filefilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false);
        return cb(new Error("Only jpg,png and jpeg formatted allowed"));
    }
}
  
  export const uploadFiles = multer({ 
    storage: storage,
    filefilter: filefilter
}).single("file");
