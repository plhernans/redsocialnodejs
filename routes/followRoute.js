const express = require("express");
const router = express.Router();
const followCtrl = require("../controllers/followsController");

//Definir rutas
router.get("/prueba-follow", followCtrl.pruebaFollow);


//Exportar el router para luego cargarlo posteriormente
module.exports = router;
