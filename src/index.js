import "dotenv/config"

import express from "express"
import cors from "cors"
import * as OpenApiValidator from 'express-openapi-validator';

import authRouter from "./routers/authRouter.js"
import userRouter from "./routers/userRouter.js"
import movieRouter from "./routers/movieRouter.js"
import ratingRouter from "./routers/ratingRouter.js"

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(express.json())
app.use(
  OpenApiValidator.middleware({
    apiSpec: './moviesAPISpec.yaml',
    validateRequests: true
  }),
);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.use(`/api/${process.env.API_VERSION}/auth/`, authRouter)
app.use(`/api/${process.env.API_VERSION}/users/`, userRouter)
app.use(`/api/${process.env.API_VERSION}/movies/`, movieRouter)
app.use(`/api/${process.env.API_VERSION}/ratings/`, ratingRouter)

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

app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}!`)
})