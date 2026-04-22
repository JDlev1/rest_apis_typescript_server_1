import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config()

const db= new Sequelize(process.env.DATABASE_URL!,{
    models:[__dirname + '/../models/**/*'],
    logging:false
})
//?ssl=true al final para obligar la conexion {}

export default db