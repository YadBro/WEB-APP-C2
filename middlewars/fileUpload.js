import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        // SET IMAGE SIZE
        fileSize: 2000000 // 2mb
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    // Allowed EXT
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    // function test is : Mengembalikan nilai Boolean yang menunjukkan apakah pola ada dalam string yang dicari atau tidak.
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Image Only');
    }
}