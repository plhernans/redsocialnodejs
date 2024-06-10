const Publication = require("../models/Publication");

const fs = require("fs");
const bbpath = require("path");
const followService = require("../services/followServices");

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
    //sacar el id de la publicacion a eliminar
    let publicationId = req.params.id

    //find
    Publication.find({
        "user": req.user.id,
        "_id": publicationId
    })
    .deleteOne()
    .then((rs) =>{
        if(rs.deletedCount == 1){
            return res.status(200).send({
                status:"success",
                message: "Publicacion eliminada",
                publicationId,
                rs
            })
        }
        else{
            return res.status(404).send({
                status: "error",
                message: "Publicacion no encontrada"
            }) 
        }
    })
    .catch((error) =>{
        return res.status(500).send({
            status:"error",
            mensaje: "Error al eliminar la publicacion "+error 
        });
    })
}

//Accion para listar publicaciones de usuario en concreto
const publicationList = (req, res) =>{

    let userId = req.params.id

    let page = 1;

    if(req.params.page){
        page=req.params.page
    }

    itemPerPage = 5;

    Publication.find({"user":userId})
    .sort("-created_at")
    .select("text _id")
    .populate("user", "-_id -__v -password -role -created_at")
    .paginate(page, itemPerPage) 
    .then(async(publicationStored) =>{
        if(publicationStored){
            let rs = await Publication.find({"user":userId}).exec();
            let total = rs.length
            return res.status(200).send({
                status:"success",
                message: "Listado de publicaciones",
                page,
                itemPerPage,
                total,
                totalPaginas: Math.ceil(total/itemPerPage),
                publicationStored  
            })
        }
        else{
            return res.status(404).send({
                status: "error",
                message: "Error al obtener el listado de publicaciones"
            }) 
        }
    })
    .catch((error) =>{
        return res.status(500).send({
            status:"error",
            mensaje: "Error de sintaxi"+error 
        });
    }) 
}

//Accion subir fichero
const upload = (req, res) => {

    //Recoger id de la publicacion
    const publicationId = req.params.id

    //Recoger el fichero de imagen y comprobar que existe
    if(!req.file){
        return res.status(404).send({
            status: "error",
            message: "La peticion no incluye la imagen",
        })
    }

    //Conseguir elnombre del archivo
    let image = req.file.originalname;

    //Sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1]; 

    //Comprobar extension
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){
       
       //Si no es correcta, se borra el fichero 
       const filePatch = req.file.path;
       fs.unlinkSync(filePatch);

       //devoler respuesta negativa
       return res.status(404).send({
            status: "error",
            message: "Extension del fichero invalida",
        })
    }

    //Si es correcta, se guarda en la BD
    Publication.findByIdAndUpdate({"user": req.user.id, "_id":publicationId}, {file: req.file.filename}, {new:true})
    .then((publicationUpdated) => {
        //if(!userUpdated && userUpdated.length ==0){
            return res.status(200).send({
                status: "success",
                user: publicationUpdated,
                file: req.file
            })
       // }
    })
    .catch((error) =>{
        //devoler respuesta negativa
       return res.status(500).send({
            status: "error",
            message: "Actualizacion de subida de fichero incorrecta",
        });
    })
}

//Accion devolver archivo multimedia
const filePublication = (req, res) => {
    
    //Obtener el id de la imagen
    const file = req.params.file

    //Cargar la ruta del file
    let filePath = "./uploads/publications/"+file;

    fs.stat(filePath, (error, exist) =>{
        if(!exist){
            return res.status(500).send({
                status: "error",
                message: "La imagen no existe",
            })
        }
        return res.sendFile(bbpath.resolve(filePath));
    })
}


//Accion para listar las publicaciones de los usuarios que estoy siguiendo
const feed = async(req, res) =>{

    //Sacar la pagina actual
    let page = 1;
    if(req.params.page){
        page=req.params.page;
    }

    //Establecer numero de elementos por pagina
    const itemPerPage = 5;

    //Obtener array de identificadores de usuario que yo sigo
    try{
        const myfollows = await followService.followUsersId(req.user.id);
        
        //find a publicaciones utilizando el operador in (para sacar todas las publicaciones de los usuarios que yo sigo)
        const publications = await Publication.find({
            /*user:myfollows.following*/ //de esta manera implicitamente se hace un IN

            //Otra manera de hacer el IN seria de esta manera
            user:{"$in": myfollows.following}
        })
        .populate("user", "-role -__v -password -created_at -email")
        .sort("-created_at")
        .paginate(page, itemPerPage)
        .then(async (publicationsStoraged) =>{

            if(!publicationsStoraged || publicationsStoraged <= 0){
                return res.status(500).send({
                    status: "error",
                    message: "Error en la consulta "+error
                })
            }
            let rs = await Publication.find({user:{"$in": myfollows.following}}).exec();
            let longitud = rs.length;

            return res.status(200).send({
                status: "success",
                message: "Feed",
                follows: myfollows.following,
                user: req.user.id,
                publicationsStoraged,
                page,
                total:longitud,
                pages:Math.ceil(longitud/itemPerPage)
            });
        })
        .catch((error) =>{
            return res.status(500).send({
                status: "error",
                message: "Error en la consulta "+error
            })
        })  
    }
    catch (error){
        return res.status(500).send({
            status: "error",
            message: "Error, no se han listado las publicaciones del feed "+error
        })
    }
}


module.exports = {
    save,
    detail,
    remove,
    publicationList,
    upload,
    filePublication,
    feed
}