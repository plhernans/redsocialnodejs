const validate = require("validator");

const validarUsuario = (parametros) => {

    let validarName = !validate.isEmpty(parametros.name) 
                    && validate.isLength(parametros.name, {min:5, max:undefined})
                    && validate.isAlpha(parametros.name)
    
    let validarSurname = !validate.isEmpty(parametros.surname) 
                    && validate.isLength(parametros.surname, {min:5, max:undefined})
                    && validate.isAlpha(parametros.surname)

    let validarNick = !validate.isEmpty(parametros.nick) 
                    && validate.isLength(parametros.nick, {min:5, max:undefined})
                    && validate.isAlpha(parametros.nick)
    
    let validarEmail = !validate.isEmpty(parametros.email) 
                    && validate.isEmail(parametros.email)

    let validarPassword = !validate.isEmpty(parametros.password) 
                    && validate.isAlphanumeric(parametros.password)

    let validarBio = !validate.isEmpty(parametros.bio) 
    
    if(!validarName || !validarSurname || !validarEmail || !validarPassword || !validarNick || !validarBio){
        throw new Error("No se ha podido validar la informacion");
    }
    else{
        console.log("no ha pasado la validacion");
    }
}

module.exports = {
    validarUsuario
}