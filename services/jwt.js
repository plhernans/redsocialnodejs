//importar dependencia
const jwt = require("jwt-simple");
const moment = require("moment");

//clave secreta
const secret = "CLAVE_SECRETA_DEL_CURSO_del_proyecto_DE_LA_RED_soCIAL98455";

//crear una funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), // crea la fecha el momento en que se crea el token en formato unix
        exp: moment().add(30, "days").unix() // es la expiracion de la fecha, en este caso le pusimos 30 dias
    };
    //devolver jwt token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}

