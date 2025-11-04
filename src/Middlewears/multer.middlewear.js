import multer from "multer";
import fs from "fs";
import sharp from "sharp";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  }
});

const upload = multer({
  storage,
  fileFilter: async function (req, file, cb) {
    try {
   
      cb(null, true);

      process.nextTick(async () => {
        const filePath = `./Public/temp/${file.filename}`;

       
        if (!fs.existsSync(filePath)) return;

        const metadata = await sharp(filePath).metadata();
        const { width, height } = metadata;
        const type = req.body?.type; 
        let invalid = false;
        let msg = "";

        if (type === "avatar" && height <= width) {
          invalid = true;
          msg = "Avatar must be vertical (portrait)";
        } else if (type === "background" && width <= height) {
          invalid = true;
          msg = "Background must be horizontal (landscape)";
        }

      
        if (invalid) {
          fs.unlinkSync(filePath);
          req.uploadError = msg;
        } else {
         
        }
      });
    } catch (error) {
      cb(new Error("Error processing image"));
    }
  }
});

export { upload };
