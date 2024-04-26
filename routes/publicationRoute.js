const express = require("express");
const router = express.Router();
const publicationCtrl = require("../controllers/publicationsController");

//Definir rutas
router.get("/prueba-publication", publicationCtrl.pruebaPublication);


//Exportar el router para luego cargarlo posteriormente
module.exports = router;
