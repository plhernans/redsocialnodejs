const express = require("express");
const router = express.Router();
const check = require("../middlewares/auth")
const publicationCtrl = require("../controllers/publicationsController");

//Definir rutas
router.get("/prueba-publication", publicationCtrl.pruebaPublication);
router.post("/save", check.auth, publicationCtrl.save);
router.get("/detail/:id", check.auth, publicationCtrl.detail);
router.delete("/remove/:id", check.auth, publicationCtrl.remove);
//Exportar el router para luego cargarlo posteriormente
module.exports = router;
