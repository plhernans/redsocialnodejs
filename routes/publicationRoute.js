const express = require("express");
const router = express.Router();
const check = require("../middlewares/auth")
const multer = require("multer");
const publicationCtrl = require("../controllers/publicationsController");

//Configuracion del multer para la subida de imagen
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads/publications/'); // el metodo cb nos permite indicar donde queremos que sea el destino de subida de archivo
    },
    filename: (req, file, cb) => {
        cb(null, "pub_"+ Date.now()+file.originalname);    //aqui el metodo cb tambien nos va a permitir poner el nombre del archivo que deseamos
    }
});
const uploads = multer({storage: storage}); //aqui le decimos a multer que debe aplicar el almacenamiento al metodo storage

//Definir rutas
router.post("/save", check.auth, publicationCtrl.save);
router.get("/detail/:id", check.auth, publicationCtrl.detail);
router.delete("/remove/:id", check.auth, publicationCtrl.remove);
router.get("/list/:id/:page?", check.auth, publicationCtrl.publicationList);
router.post("/upload/:id", [check.auth, uploads.single("file0")], publicationCtrl.upload);
router.get("/filepublication/:file", publicationCtrl.filePublication);
router.get("/feed/:page?", check.auth, publicationCtrl.feed);
//Exportar el router para luego cargarlo posteriormente
module.exports = router;
