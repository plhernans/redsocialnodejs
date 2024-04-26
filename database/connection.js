const mongoose = require("mongoose");

const connection = async() => {

    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_redsocial");
        console.log("Conectado correctamente a la BD mi_redsocial");
    }
    catch(error){
        console.log(error);
        throw new Error("No se ha podido establecer la conexion con la base de datos");
    }
}

module.exports = {connection};