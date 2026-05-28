import express from 'express'
import { userRouter } from './routes/user'
import { brainRouter } from './routes/brain'

const app = express()
app.use(express.json())

app.use('/api/v1', userRouter)
app.use('/api/v1/brain', brainRouter)

app.listen(3000, function(){
    console.log(`post started on http://localhost:3000`)
})