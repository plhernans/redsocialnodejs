//Importar modulos o dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

//Importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//Middelware de autenticacion
exports.auth = (req, res, next) => {
    
    //Comprobar si me llega la cabecera de auth
    if(!req.headers.authorization){
        return res.status(403).send({
            status:"error",
            message: "La peticion no tiene la cabecera de ejecucion"
        })
    }
    //Limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    //Decodificar el token
    try{
        let payload = jwt.decode(token, secret);

        //comprobar la expiracion del token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status:"error",
                message: "Token expirado",
                error: error
            })
        }

        //agregar datos de usuario a request
        req.user = payload;
    }
    catch(error){
        return res.status(404).send({
            status:"error",
            message: "Token invalido",
            error: error
        });
    }
    //Pasar a ejecucion de accion
    next();
}
