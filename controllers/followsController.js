const Follow = require("../models/Follow");
const User = require("../models/User");

//Acciones de prueba
const pruebaFollow = (req, res) => {
    return res.status(200).send({
        mensaje: "mensaje enviado desde el controlador desde controller/followsController"
    })
}

module.exports = {
    pruebaFollow
}