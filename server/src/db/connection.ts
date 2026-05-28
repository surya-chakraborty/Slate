import mongoose from 'mongoose'
import { MONGO_URL } from '../config/env'

// Mongoose dns connection problem fix
const dns = require('dns')

dns.setServers(['8.8.8.8', '1.1.1.1'])

const DBConnect = async () => {
    try{
        await mongoose.connect(MONGO_URL as string)
        console.log('Connected Succefully')
    }catch(err){
        if(err instanceof Error){
            console.log("Error Ocurred:  ", err.message)
        }
    }
}

export default DBConnect