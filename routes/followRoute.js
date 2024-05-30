const express = require("express");
const router = express.Router();
const followCtrl = require("../controllers/followsController");
const check = require("../middlewares/auth");

//Definir rutas
router.get("/prueba-follow", followCtrl.pruebaFollow);
router.post("/save", check.auth, followCtrl.save);
router.delete("/unfollow/:id", check.auth, followCtrl.unfollow);
router.get("/following/:id?/:page?", check.auth, followCtrl.following);
router.get("/followers/:id?/:page?", check.auth, followCtrl.followers);


//Exportar el router para luego cargarlo posteriormente
module.exports = router;
