import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import cors,{ CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUi from "swagger-ui-express"
import swaggerSpec , { swaggerUiOptions }from "./config/swagger";
import { reset } from "supertest/lib/cookies";

//conectar a base de datos 
export async function connectDB(){
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.blue('Conexxion exitante a la BD'))

    } catch (error) {
        //console.log(error)
        console.log(colors.bgRed.bold('hubo un error al conectar la base de datos X=('))
    }
}

connectDB()
// instancia de expresss 
const server=express()
//permitir cors  conexiones
const corsOptions : CorsOptions = {
    origin : function(origin,callback){
        if(origin== process.env.FRONTEND_URL){
            callback(null,true)
        }else{
            callback(new Error('error de CORS '))
        }
    }
}
server.use(cors(corsOptions))

// leer datos de formulario
server.use(express.json())
//detalles de peticiones 
server.use(morgan('dev'))

//ruta a los http a los router
server.use('/api/products',router)
    
server.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec,swaggerUiOptions))


export default server