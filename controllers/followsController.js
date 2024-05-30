const Follow = require("../models/Follow");
const User = require("../models/User");

//Importar dependencias 
const mongoosepagination = require("mongoose-pagination");

//Acciones de prueba
const pruebaFollow = (req, res) => {
    return res.status(200).send({
        mensaje: "mensaje enviado desde el controlador desde controller/followsController"
    })
}

const save = (req, res) =>{

    //Conseguir datos enviados por body
    let params = req.body;

    //Sacar id del usuario identificado
    const identity = req.user;

    //Crear objecto con modelo follow
    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });
    //Guardar objeto en la bbdd
    userToFollow.save()
    .then((followStore) =>{
        if(followStore){
            return res.status(200).send({
                status: "success",
                message: "Follower Guardado",
                followStore
            });
        }
    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "Error al guardar el follower "+error,

        });
    })
}

const unfollow = (req, res) =>{

    //Recoger el id del usuario que ya no voy a seguir
    let idToUnfollow = req.params.id;

    //Recoger el id del usuario identificado
    let userId = req.user.id

    //eliminar el follow de ese usuario
    Follow.find({
        "user": userId,
        "followed": idToUnfollow
    })
    .deleteOne()
    .then((followedDeleted) =>{
        return res.status(200).send({
            status: "success",
            message: "Eliminado el followed",
        });
    })
    .catch((error) =>{
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar al usuario followed "+error
        });
    })
}

//metodo que devuelve los usuaios que sigo
const following = (req, res) =>{
    //Sacar el id del usuario identificado  
    let userId = req.user.id;

    //comprobar el id que nos llega por parametro en la url
    if(req.params.id){
        userId = req.params.id;
    }
    //comprobar si me llega la pagina, en caso que no llegue seria la pagina 1
    let page = 1;

    if(req.params.page){
        page = req.params.page;
    }
    //Cuantos usuarios por pagina quiero mostrar
    const itemPerPage = 5;

    //Find a follow y popular los datos de follow
    Follow.find({
        "user":userId
    })
    .populate("user followed")
    .then((follows) =>{
        return res.status(200).send({
            status: "success",
            follows,
        });
    })
    //paginar con mongoose

    //listado de los usuarios del user1 y soy pepe
    //sacar un array de los ids de los usuarios que me siguen a user1 y a pepe

    
}

//metodo que devuelve los usuarios que me estan siguiendo
const followers = (req, res) =>{
    return res.status(200).send({
        status: "success",
        message: "usuarios que te siguen",
    });
}

module.exports = {
    pruebaFollow,
    save,
    unfollow,
    following,
    followers
}