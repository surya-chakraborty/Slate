import { Request, Response, NextFunction} from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_USER_SECRET } from '../config/env'

function auth(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization

    if(token){

        const user = jwt.verify(token as string, JWT_USER_SECRET as string)
        if(user){
            if(typeof user === 'string'){
                return res.status(403).json({
                    message: "You are not logged in!"
                })
            }
            req.userId = (user as JwtPayload).id
            next()
        }else{
            return res.json({
                message: 'wrong creads!'
            })
        }
    }else{
        return res.json({
            message: 'authorization denied!'
        })
    }
}