const express = require("express");
const router = express.Router();
const multer = require("multer");
const usersCtrl = require("../controllers/usersController");
const check = require("../middlewares/auth");

//Configuracion del multer para la subida de imagen
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads/avatars/'); // el metodo cb nos permite indicar donde queremos que sea el destino de subida de archivo
    },
    filename: (req, file, cb) => {
        cb(null, "avatar_"+ Date.now()+file.originalname);    //aqui el metodo cb tambien nos va a permitir poner el nombre del archivo que deseamos
    }
});
const upload = multer({storage: storage}); //aqui le decimos a multer que debe aplicar el almacenamiento al metodo storage


//Definir rutas
router.get("/prueba-usuario", check.auth, usersCtrl.pruebaUser);
router.post("/register", usersCtrl.registerUser);
router.post("/login", usersCtrl.login);
router.get("/profile/:id", check.auth, usersCtrl.profile);
router.get("/list/:page?", check.auth, usersCtrl.list);
router.put("/update", check.auth, usersCtrl.update);
router.post("/upload", [check.auth, upload.single("file0")], usersCtrl.uploadFile);
router.get("/avatar/:file", usersCtrl.avatar);
router.get("/counters/:id", check.auth, usersCtrl.counters);

//Exportar el router para luego cargarlo posteriormente
module.exports = router;


