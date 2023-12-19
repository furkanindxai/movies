import "dotenv/config"

import express from "express"
import cors from "cors"

import authRouter from "./routers/authRouter.js"
import userRouter from "./routers/userRouter.js"
import movieRouter from "./routers/movieRouter.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use(`/api/${process.env.API_VERSION}/auth/`, authRouter)
app.use(`/api/${process.env.API_VERSION}/users/`, userRouter)
app.use(`/api/${process.env.API_VERSION}/movies/`, movieRouter)

app.use((req, res) => {
          res.json({
            error: {
              'name':'Error',
              'status':404,
              'message':'Invalid Request',
              'statusCode':404,
            },
             message: 'Invalid route!'
          });
});

app.listen(3000, ()=> {
    console.log("Server is listening on port 3000!")
})