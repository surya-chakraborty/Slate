import mongoose from 'mongoose'
import { MONGO_URL } from '../config/env'

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