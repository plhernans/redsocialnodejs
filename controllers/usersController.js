//importar dependencias y modulos

//Importar modelo
const User = require("../models/User");

//Importar dependencias y modelos
const bcrypt = require("bcrypt");
const mongoosepagination = require("mongoose-pagination");

//Importar servicios
const jwt = require("../services/jwt")

//Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        mensaje: "mensaje enviado desde el controlador desde controller/usersController",
        user: req.user
    })
}

const registerUser = (req, res) => {

    //Recoger datos del body
    let params = req.body;

    //realizar validation
    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos para realizar el registro"
        });
    }
    //control de usario duplicados
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() },
        ]
    })
        .then(async (userEcontrado) => {
            if (!userEcontrado) {
                return res.status(500).json({
                    status: "error",
                    message: "error en la consulta"
                });
            }

            if (userEcontrado && userEcontrado.length >= 1) {
                return res.status(200).send({
                    status: "success",
                    message: "el usuario ya existe "
                });
            }

            //cifrar la contraseña, (de esta forma solo debes eliminar el async y el script de la linea await)
            // bcrypt.hash(userToSave.password, 10, (error, pwd) =>{
            //     userToSave.password = pwd
            // });

            //otra manera de cifrar la contraseña seria asi
            let pwd = await bcrypt.hash(params.password, 10);
            params.password = pwd;
            params.name = params.name.toUpperCase();
            params.surname = params.surname.toUpperCase();
            //Crear objeto de usuario
            let userToSave = new User(params);

            //Guardar usario en la base de datos
            userToSave.save()
                .then((userStoraged) => {
                    if (!userStoraged) {
                        return res.status(500).send({
                            status: "error",
                            message: "error al guardar el usuario"
                        });
                    }
                    //Devolver resultado
                    return res.status(200).json({
                        status: "success",
                        message: "Accion de registro exitosa",
                        user: userStoraged
                    });
                })
                .catch((error) => {
                    return res.status(500).send({
                        status: "error",
                        message: "error al guardar el usuario " + error
                    });
                })
        })

}


const login = (req, res) => {

    //recoger parametros del body
    let params = req.body;

    //valido la informacion enviada del body
    if (!params.email || !params.password) {
        return res.status(404).send({
            status: 'error',
            message: "Faltan datos por enviar"
        });
    }
    //buscar en la base de datos que exista el usuario
    User.findOne({ email: params.email })
        //.select({ "password": 0 }) // permite seleccionar de la BD que campos quiero retornar  //comento esta linea para poder acceder al password y poder comparar para saber si esta correcto
        .then(async(userFound) => {

            if (!userFound || userFound.length == 0) {
                return res.status(404).send({
                    status: 'error',
                    message: "Usuario no encontrado"
                });
            }
            //comprobar su contraseña
            let pwd = await bcrypt.compareSync(params.password, userFound.password)
            if(!pwd || pwd == false){
                return res.status(404).send({
                    status: 'error',
                    message: "Login and/or password is incorrect"
                });
            }
            //conseguit el token JWT
            const token = jwt.createToken(userFound);

            //eliminar la passwd para evitar que sea visible por el cliente

            //devolver datos de usuarios
            return res.status(200).send({
                status: 'success',
                message: "Te has identificado correctamente",
                user: {
                    id: userFound._id,
                    name: userFound.name,
                    nick: userFound.nick
                },
                token
            });
        })



}

const profile = (req, res) => {

    //Recibir el id por la url
    let iduser = req.params.id;
    //buscar los datos en la bd que pertenece a ese id
    User.findById(iduser)
    .select({password:0, role:0})
    .then((userReturned) => {
        if(!userReturned || userReturned.length == 0){
            return res.status(200).send({
                status: "success",
                message: "El usuario no existe o hay algun error"
            });
        }
        //devolver resultado
        return res.status(200).send({
            status: "sucess",
            message: "Profile encontrado",
            user: userReturned
        });
    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Error en la busqueda"
        })
    })
}

const list = (req, res) => {
    
    //Controlar en que pagina estamos
    let page = 1;
    if(req.params.page){
        page=req.params.page;
    }
    page = parseInt(page); //convertimos en un entero

    //Consultar con mongoose pagination
    //A este metodo hay que pasarle el numero de pagina en la que estamos y el numero de items por pagina
    let itemPerPage = 5;

    // let total = User.find().count("_id");
    // console.log(total);
    User.find().sort('_id').paginate(page, itemPerPage)
    .then(async (users) => {
        let total = await User.find().count();
        if(!users || users.length == 0){
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios disponibles"
            });
        }
        //Devolver resultado (posteriormente info de follows)
        return res.status(200).send({
            status: "success",
            message: "Ruta de listado e usuario",
            users,
            page: page,
            itemPerPage,
            total,
            pages: Math.ceil((total/itemPerPage))
        });
    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "Error en la consulta",
            error
        });
    })
}

//Update users....
const update = (req, res) => {

    //En este caso los datos que queremos actualizar estan dentro del token, por lo que 
    let userIdentity = req.user; //Datos de usuario registrado
    let userToUpdate = req.body; //Datos de usario para actualizar

    //De aqui eliminamos los datos que no queremos que se muestran para no comprometer la seguridad del sistema
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    //1ro ReCoger info del usuario a actualizar
    User.find({
        $or: [
            {nick: userToUpdate.nick.toLowerCase()},
            {email: userToUpdate.email.toLowerCase()}
        ]
    })
    .then(async (users) => {
        
        if(!users){
            return res.status(500).json({
                status: "error",
                message: "error en la consulta",
                users    
            });
        }
        
        let userIsset = false;
        users.forEach(user => { 
            if(user && user._id != userIdentity.id) userIsset = true;  
        });

        if(userIsset){
            return res.status(200).send({
                status: "success",
                message: "el usuario ya existe ",
                userIsset
            });
        }
        
        if(userToUpdate.password){
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        }

        //Buscar y actualizar
        // User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new:true})
        // .then((userUpdated) => {
        //     return res.status(200).send({
        //         status: "success",
        //         message: "Usuario Actualizado ",
        //         userUpdated
        //     });
        // })
        // .catch((error) => {
        //     return res.status(500).send({
        //         status: "success",
        //         message: "Usuario al actualizar usuario",
        //         error
        //     });
        // })


        //Buscar y actualizar otra variante para actualizar datos, y como es una opcion suceptible a erroes lo metemos dentro de un try catch
        try{
            let userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new:true});

            if(!userUpdated){
                return res.status(404).send({
                    status: "error",
                    message: "Error al actualizar usuario",
                });
            }

            return res.status(200).send({
                status: "success",
                message: "Usuario Actualizado ",
                userUpdated
            }); 
        }
        catch(error){
            return res.status(500).send({
                status: "error",
                message: "Error al actualizar usuario",
            });
        }   
    })
}

const uploadFile = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Image upload",
        user: req.user,
        file: req.file,
        files: req.files
    }); 
}

module.exports = {
    pruebaUser,
    registerUser,
    login,
    profile,
    list,
    update,
    uploadFile
}