//Acciones de prueba
const pruebaPublication = (req, res) => {
    return res.status(200).send({
        mensaje: "mensaje enviado desde el controlador desde controller/publicationController"
    })
}

module.exports = {
    pruebaPublication
}