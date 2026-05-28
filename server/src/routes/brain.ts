import {Router, Request, Response} from 'express'
import { auth } from '../middleware/auth'
import { ContentModel, LinkModel, UserModel } from '../models/db'
import { random } from '../utils/utils'

export const brainRouter = Router()

brainRouter.post('/share', auth, async function(req, res){
    const share = req.body.share // true or false

    // we are expecting when share: true if link exists already return in res, if not then create and share the link
    // and if, share: false, delete the already existing link

    if(!share){
        try {
            // Fitrst check if already exiosting link is there 
            const existingLink = await LinkModel.findOne({
                userId: req.userId
            })
    
            if(existingLink){
                return res.json({
                    hash: existingLink.hash
                })
    
            }
            const hash = random(10)
            await LinkModel.create({
                hash,
                userId: req.userId
            })

            return res.json({
                hash
            })

        }catch(e){
            return res.status(500).json({
                message: 'Internal server error!'
            })
        }
    } else{
        await LinkModel.deleteOne({
            userId: req.userId
        })
        return res.json({
            message: 'Removed Link!'
        })
    }

})

brainRouter.get('/:shareLink', async function(req, res){
    const hash = req.params.shareLink

    const link = await LinkModel.findOne({
        hash: hash,
    })
    if(!link){
        return res.status(411).json({
            message: "Incorrect link!"
        })
    }

    const contents = await ContentModel.find({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })    
    if(!user){
        return res.status(411).json({
            message: 'user not found!'
        })
    }

    return res.status(200).json({
        username: user.username,
        content: contents
    })

})