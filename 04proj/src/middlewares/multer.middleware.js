import multer from "multer";
import path from "path"

// use context in route
const storage = multer.diskStorage({
    //         req=>body have json data, file is uploaded file
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)       // .jpg
        const name = path.basename(file.originalname, ext) // SahilChallan1
        cb(null, name + '-' + uniqueSuffix + ext)
    }
})

export const upload = multer({ storage })

// const storage = {
//   destination: fn,
//   filename: fn
// }

// const upload = {
//   storage: storage,
//   fields: function() {
//     // use this.storage to save files
//   }
// }
