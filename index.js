
//Importar dependencias
const {connection} = require('./database/connection');  
const express = require("express");
const cors = require("cors");

//Mensaje de bienvenida
console.log("Api Node para red Social arrancada");

// conexion a la base de datos
connection();

//crear servidor node
const app = express();  //se utilizar paa cargar o configurar algo dentro de express
const port = 3900;

//configurar cors
app.use(cors()); 

//convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cargar configuracion de rutas
const userRoutes = require("./routes/usersRoute");
const followRoutes = require("./routes/followRoute");
const publicationRoutes = require("./routes/publicationRoute");

//cargamos las rutas dentro del metodo express
app.use("/api/user", userRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/publication", publicationRoutes);
//prueba
app.get("/ruta-prueba", (req, res) => {

    return res.status(200).json(
        {
            "id": 1,
            "nombre":"pepe",
            "web": "www.victoria.es"
        }
    );
})

//poner el servidor a escuchar peticiones https
app.listen(3900, () => {
    console.log("Servidor corriendo en el puerto "+port);
})

