const Publication = require("../models/Publication");
const publicModel = require("../models/Publication");

//Accion para guardar publicacion
const save = (req, res) =>{
    //Recoger datos del body
    let params = req.body;
   
    //Si no llegan dar respuesta negativa
    if(!params.text){
        return res.status(400).send({
            status: "error",
            mensaje: "Error, debe enviar el texto de la publicacion"
        });
    }
    //Crear y rellenar objeto del model
    let newPublication = new Publication(params)
    newPublication.user = req.user.id
    newPublication.save()
    .then((publicationSaved) => {
        return res.status(200).send({
            status:"success",
            mensaje: "Publication Saved",
            publicationSaved
        });
    })
    .catch((error) =>{
        return res.status(500).send({
            status: "error",
            mensaje: "No se ha guardado la publicacion "+error
        });
    })
    //Guardar objeto en BD
}

//Sacar una publicacion
const detail = (req, res) =>{
    
    let idPublication = req.params.id

    Publication.findById(idPublication)
    .then((publicationStored) =>{
        if(!publicationStored == ""){
            return res.status(200).send({
                status:"success",
                mensaje: "Publicacion listada",
                publicationStored
            });
        }
        else{
            return res.status(404).send({
                status:"error",
                mensaje: "Publicacion no encontrada"
            });
        }
    })
    .catch((error) =>{
        return res.status(500).send({
            status:"error",
            mensaje: "Error al obtener la publicacion "+error 
        });
    })
    
}

//Accion eliminar publicaciones
const remove = (req, res) =>{

    let publicationId = req.params.id

    let publicationSelected = Publication.findById(publicationId)
    
    if(!publicationSelected){
        return res.status(500).send({
            status:"error",
            mensaje: "Error no existe la publicacion" 
        });  
    }
    else{
        publicationSelected.deleteOne()
        .then((publicationDeleted) =>{
            return res.status(200).send({
                status:"success",
                mensaje: "Publicacion eliminada",
            });
        })
        .catch((error) =>{
            return res.status(500).send({
                status:"error",
                mensaje: "Error al eliminar la publicacion "+error 
            });
        })
    }
}

//Accion para listar las publicaciones


//Accion para listar publicaciones de usuario en concreto



//Accion subir fichero

//Accion devolver archivo multimedia

//Acciones de prueba
const pruebaPublication = (req, res) => {
    return res.status(200).send({
        mensaje: "mensaje enviado desde el controlador desde controller/publicationController"
    })
}

module.exports = {
    pruebaPublication,
    save,
    detail,
    remove
}