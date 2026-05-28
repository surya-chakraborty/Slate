import { Router, Request, Response} from 'express'
import { ContentModel, UserModel } from '../models/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_USER_SECRET } from '../config/env'
import { auth } from '../middleware/auth'

export const userRouter = Router()

userRouter.post('/signup', async function(req: Request, res: Response){
    const { username, password } = req.body

    if(!username || !password){
        return res.status(411).json({
            message: 'Error in Inputes, all creds required!'
        })
    }

    const user = await UserModel.findOne({
        username: username
    })

    if(user){
        return res.status(403).json({
            message: 'User already exists with the username!'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await UserModel.create({
        username: username,
        password: hashedPassword
    })
    return res.status(200).json({
        message: 'Signed Up!'
    })

})

userRouter.post('/signin', async function(req: Request, res: Response){
    const { username, password } = req.body

    try {
        const user = await UserModel.findOne({
            username
        })

        if(user){
            const token = await jwt.sign({
                username: username
            }, JWT_USER_SECRET as string)

            return res.status(200).json({
                token: token
            })
        }else{
            return res.status(403).json({
                message: 'Wrong email or password!'
            })
        }
    }catch(e){
        return res.status(500).json({
            message: "Internal Server error"
        })
    }
})

userRouter.post('/content', auth,  async function(req: Request, res: Response){
    const { type, link, title, tags } = req.body

    if(!type || !link || !title || !tags){
        res.status(403).json({
            message: 'all fields required!'
        })
    }

    try {
        await ContentModel.create({
            type, 
            link, 
            title,
            tags,
            userId: req.userId
        })

        return res.status(200).json({
            message: 'Content added!'
        })

    }catch(e){
        res.status(500).json({
            message: 'Internal DB error'
        })
    }

})

userRouter.get('/content', auth, async function(req: Request, res: Response){
    
    try {
        const contents = await ContentModel.find({
            userId: req.userId
        }).populate('userId', 'username')
    
        return res.status(200).json({
            contents
        })

    }catch(e){
        res.status(500).json({
            message: 'Internal server error!'
        })
    }
}) 

userRouter.delete('/content', auth, async function(req: Request, res: Response){
    const { contentId } = req.body
    try {
        const content = await ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        })

        if(content){
            return res.status(200).json({
                message: 'Deleted!',
                deletedContent: content
            })
        }else{
            return res.status(403).json({
                message: "Trying to delete a doc you don't own"
            })
        }

    }catch(e){
        res.status(500).json({
            message: 'Internal server error!'
        })
    }

})